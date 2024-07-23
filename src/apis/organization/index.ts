import graphql from "../../helpers/graphql";
import Crypt from "../../services/crypt/crypt.service";
import Mailer from "../../services/mailer/mailing";
import { Organization } from "../../types";
import { Request, Response } from "express";

interface OrganizationAPI {
  register: any;
  login: any;
  verify: any;
  get: any;
  updateCallback: any;
  getUser: any;
  sendOTP: any;
  verifyOTP: any;
}

const Organization: OrganizationAPI = {
  register: null,
  login: null,
  verify: null,
  get: null,
  updateCallback: null,
  getUser: null,
  sendOTP: null,
  verifyOTP: null,
};

Organization.register = async (req: Request, res: Response) => {
  const data = req.body as Partial<Organization>;
  const crypt = new Crypt();
  data.api_key = crypt.genAPIKEY();
  data.hotp_secret = crypt.genSECRET();

  const query = `mutation RegisterOrganization($data: organizations_insert_input!) {
  insert_organizations_one(object: $data) {
    id
    api_key
  }
}
`;
  try {
    const response = await graphql(query, { data });
    if (response.data.insert_organizations_one) {
      res.json(response.data.insert_organizations_one);
      const mailer = new Mailer();
      mailer.sendOrganizationEmail(
        data.email!,
        response.data.insert_organizations_one.id
      );
    } else {
      console.log(response);
      res.status(400).json({ error: "Something Went Wrong" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
};

Organization.login = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const response = await graphql(
      `
        query FindOrganization($email: String!) {
          organizations(where: { email: { _eq: $email } }) {
            hotp_secret
            hotp_counter
            email
          }
        }
      `,
      { email }
    );
    if (response.data.organizations?.length) {
      const org = response.data.organizations.at(0) as Partial<Organization>;
      const crypt = new Crypt();
      const otp = crypt.genHOTP(org.hotp_secret!, String(org.hotp_counter));
      const mailer = new Mailer();
      mailer.sendOTPEmail(org.email!, otp);
      res.sendStatus(200);
    } else {
      res.status(400).json({ error: "Account Not Found" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
};

Organization.verify = async (req: Request, res: Response) => {
  const { key } = req.body;

  try {
    const response = await graphql(
      `
        query FindOrganization($key: String!) {
          organizations(where: { api_key: { _eq: $key } }) {
            api_key
            name
            callback_url
          }
        }
      `,
      { key }
    );
    if (!response.data.organizations?.length) {
      return res.status(400).json({ error: "Invalid Organization" });
    }
    const org = response.data.organizations.at(0) as Organization;
    const crypt = new Crypt();
    const message = crypt.genPusherMessage();
    res.json({ key: org.api_key, name: org.name, callback: org.callback_url, message });
  } catch (e) {
    res.status(500).json(e);
  }
};

Organization.get = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const response = await graphql(
      `
        query GetOrganization($id: uuid!) {
          organizations_by_pk(id: $id) {
            callback_url
            email
            id
            name
            api_key
            secrets_aggregate {
              aggregate {
                count
              }
            }
          }
        }
      `,
      { id }
    );
    if (!response.data.organizations_by_pk) {
      return res.status(400).json({ error: "Invalid Organization" });
    }
    const organization = response.data.organizations_by_pk;
    res.json(organization);
  } catch (e) {
    res.status(500).json(e);
  }
};

Organization.updateCallback = async (req: Request, res: Response) => {
  const { callback, id } = req.body;
  try {
    const response = await graphql(
      `
        mutation UpdateCallback($id: uuid!, $callback: String!) {
          update_organizations_by_pk(
            pk_columns: { id: $id }
            _set: { callback_url: $callback }
          ) {
            callback_url
          }
        }
      `,
      { id, callback }
    );
    if (!response.data.update_organizations_by_pk) {
      return res.status(400).json({ error: "Something Went Wrong" });
    }
    res.json(response.data.update_organizations_by_pk);
  } catch (e) {
    res.status(500).json(e);
  }
};

Organization.getUser = async (req: Request, res: Response) => {
  const { code } = req.body;
  const crypt = new Crypt();
  const decoded = crypt.decryptData(code);
  const data = JSON.parse(decoded);
  res.json(data);
}

Organization.sendOTP = async (req: Request, res: Response) => {
  const { id } = req.body;

  try {
    const response = await graphql(
      `
        query GetOrganizationOTPDetails($id: uuid!) {
          organizations_by_pk(id: $id) {
            id
            email
            hotp_counter
            hotp_secret
          }
        }
      `,
      { id }
    );
    if (!response.data.organizations_by_pk) {
      return res.status(400).json({ error: "Invalid Organization" });
    }
    const data = response.data.organizations_by_pk as Partial<Organization>;
    const crypt = new Crypt();
    const otp = crypt.genHOTP(data.hotp_secret!, String(data.hotp_counter!));
    const mailer = new Mailer();
    await mailer.sendOTPEmail(data.email!, otp);
    res.sendStatus(200);
  } catch (e) {
    res.status(500).json(e);
  }
};

Organization.verifyOTP = async (req: Request, res: Response) => {
  console.log(req.body)
  const { email, code } = req.body;

  try {
    const response = await graphql(
      `
        query FindOrganization($email: String!) {
          organizations(where: { email: { _eq: $email } }) {
            id
            hotp_secret
            hotp_counter
            api_key
            callback_url
            email
            id
            name
          }
        }
      `,
      { email }
    );

    if (!response.data?.organizations?.length) {
      return res.status(400).json({ error: "Account Not Found" });
    }
    const data = response.data.organizations.at(0) as Partial<Organization>;
    const crypt = new Crypt();
    const otp = crypt.genHOTP(data.hotp_secret!, String(data.hotp_counter));

    if (String(otp) === String(code)) {
      delete data.hotp_counter;
      delete data.hotp_secret;

      res.json(data);

      // Update HOTP Counter When Code matches
      graphql(
        `
          mutation IncrementHOTPCounter($id: uuid!) {
            update_organizations_by_pk(
              pk_columns: { id: $id }
              _inc: { hotp_counter: 1 }
            ) {
              hotp_counter
              id
            }
          }
        `,
        { id: data.id }
      );
    } else {
      return res.status(400).json({ error: "Invalid Code" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

export default Organization;

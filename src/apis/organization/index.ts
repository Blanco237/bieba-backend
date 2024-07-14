import graphql from "../../helpers/graphql";
import Crypt from "../../services/crypt/crypt.service";
import Mailer from "../../services/mailer/mailing";
import { Organization } from "../../types";
import { Request, Response } from "express";

interface OrganizationAPI {
  register: any;
  login: any;
  sendOTP: any;
  verifyOTP: any;
}

const Organization: OrganizationAPI = {
  register: null,
  login: null,
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
            logo
            name
          }
        }
      `,
      { email }
    );

    if (!response.data.organizations?.length) {
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
    res.status(500).json(e);
  }
};

export default Organization;

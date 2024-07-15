import { Request, Response } from "express";
import { Organization, Secret, User } from "../../types";
import Crypt from "../../services/crypt/crypt.service";
import graphql from "../../helpers/graphql";
import Mailer from "../../services/mailer/mailing";

interface UserAPI {
  register: any;
  login: any;
  scan: any;
  secrets: any;
  verifyOTP: any;
}

const User: UserAPI = {
  register: null,
  login: null,
  scan: null,
  secrets: null,
  verifyOTP: null,
};

User.register = async (req: Request, res: Response) => {
  const data = req.body as Partial<User>;
  const crypt = new Crypt();
  data.hotp_secret = crypt.genSECRET();
  try {
    const response = await graphql(
      `
        mutation CreateUser($data: users_insert_input!) {
          insert_users_one(object: $data) {
            id
            email
            hotp_secret
            hotp_counter
          }
        }
      `,
      { data }
    );
    if (!response.data.insert_users_one) {
      return res.status(400).json({ error: "Email already exist" });
    }
    const user = response.data.insert_users_one as User;
    const otp = crypt.genHOTP(user.hotp_secret, String(user.hotp_counter));
    const mailer = new Mailer();
    mailer.sendOTPEmail(user.email, otp);
    res.json({ email: user.email });
  } catch (e) {
    res.status(500).json(e);
  }
};

User.login = async (req: Request, res: Response) => {
  const { email } = req.body;
  const crypt = new Crypt();

  try {
    const response = await graphql(
      `
        query FindUser($email: String!) {
          users(where: { email: { _eq: $email } }) {
            email
            hotp_secret
            hotp_counter
          }
        }
      `,
      { email }
    );
    if (!response.data.users?.length) {
      // New User
      const res = await graphql(
        `
          mutation CreateUser($data: users_insert_input!) {
            insert_users_one(object: $data) {
              id
              email
              hotp_secret
              hotp_counter
            }
          }
        `,
        {
          data: {
            email,
            hotp_secret: crypt.genSECRET(),
          },
        }
      );
      const user = res.data.insert_users_one as User;
      const otp = crypt.genHOTP(user.hotp_secret!, String(user.hotp_counter));
      const mailer = new Mailer();
      mailer.sendOTPEmail(user.email!, otp);
      res.sendStatus(200);
      return;
    }
    // Old User
    const user = response.data.users.at(0) as Partial<User>;
    const otp = crypt.genHOTP(user.hotp_secret!, String(user.hotp_counter));
    const mailer = new Mailer();
    mailer.sendOTPEmail(user.email!, otp);
    res.sendStatus(200);
  } catch (e) {
    res.status(500).json(e);
  }
};

User.scan = async (req: Request, res: Response) => {
  const { key, message, id } = req.body;

  try {
    const orgResponse = await graphql(
      `
        query FindOrganization($key: String!) {
          organizations(where: { api_key: { _eq: $key } }) {
            id
            name
            api_key
          }
        }
      `,
      { key }
    );
    if (!orgResponse.data.organizations?.length) {
      return res.status(400).json({ error: "Invalid Organization" });
    }
    const org = orgResponse.data.organizations.at(0) as Organization;

    // TODO: Broadcast PUSHER Message

    const response = await graphql(
      `
        query CheckSecretExist($userID: uuid!, $orgID: uuid!) {
          secrets_by_pk(user_id: $userID, organization_id: $orgID) {
            user_id
            organization_id
          }
        }
      `,
      { userID: id, orgID: org.id }
    );
    if (response.data.secrets_by_pk) {
      return res.json({ name: org.name });
    }
    const crypt = new Crypt();
    const secret = crypt.genSECRET();
    const secRes = await graphql(
      `
        mutation AddTOTPSecret($data: secrets_insert_input!) {
          insert_secrets_one(object: $data) {
            user_id
            organization_id
            key
          }
        }
      `,
      { data: { user_id: id, organization_id: org.id, key: secret } }
    );
    if (!secRes.data.insert_secrets_one) {
      return res.status(400).json({ error: "Could Not Register TOTP" });
    }
    const data = secRes.data.insert_secrets_one as Secret;
    res.json({ name: org.name, secret: data.key });
  } catch (e) {
    res.status(500).json(e);
  }
};

User.secrets = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const response = await graphql(
      `
        query FindSecrets($id: uuid!) {
          secrets(where: { user_id: { _eq: $id } }) {
            key
            organization {
              name
            }
          }
        }
      `,
      { id }
    );
    const crypt = new Crypt();
    const secs = response.data.secrets as Secret[];
    const secrets = secs.map((s) => {
      return {
        name: s.organization.name,
        secret: crypt.decryptData(s.key),
      };
    });

    res.json(secrets);
  } catch (e) {
    res.status(500).json(e);
  }
};

User.verifyOTP = async (req: Request, res: Response) => {
  const { email, code } = req.body;
  try {
    const response = await graphql(
      `
        query FindUser($email: String!) {
          users(where: { email: { _eq: $email } }) {
            id
            email
            hotp_counter
            hotp_secret
            phone
          }
        }
      `,
      { email }
    );
    if (!response.data.users?.length) {
      return res.status(400).json({ error: "Account Not Found" });
    }
    const user = response.data.users.at(0) as Partial<User>;
    const crypt = new Crypt();
    const otp = crypt.genHOTP(user.hotp_secret!, String(user.hotp_counter));
    if (String(otp) === String(code)) {
      delete user.hotp_counter;
      delete user.hotp_secret;

      res.json(user);
      // Update HOTP Counter when code matches
      graphql(
        `
          mutation IncrementHOTPCounter($id: uuid!) {
            update_users_by_pk(
              pk_columns: { id: $id }
              _inc: { hotp_counter: 1 }
            ) {
              hotp_counter
              id
            }
          }
        `,
        { id: user.id }
      );
    } else {
      res.status(400).json({ error: "Invalid Code" });
    }
  } catch (e) {
    res.status(500).json(e);
  }
};

export default User;

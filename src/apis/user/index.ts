import { Request, Response } from "express";
import { User } from "../../types";
import Crypt from "../../services/crypt/crypt.service";
import graphql from "../../helpers/graphql";
import Mailer from "../../services/mailer/mailing";

interface UserAPI {
  register: any;
  login: any;
  verifyOTP: any;
}

const User: UserAPI = {
  register: null,
  login: null,
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
      return res.status(400).json({ error: "Account Not Found" });
    }
    const user = response.data.users.at(0) as Partial<User>;
    const crypt = new Crypt();
    const otp = crypt.genHOTP(user.hotp_secret!, String(user.hotp_counter));
    const mailer = new Mailer();
    mailer.sendOTPEmail(user.email!, otp);
    res.sendStatus(200);
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
            fname
            hotp_counter
            hotp_secret
            lname
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

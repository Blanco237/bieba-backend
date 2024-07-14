import graphql from "../../helpers/graphql";
import Crypt from "../../services/crypt.service";
import Mailer from "../../services/mailer/mailing";
import { Organization } from "../../types";
import { Request, Response } from "express";

interface OrganizationAPI {
  register: any;
}

const Organization: OrganizationAPI = {
  register: {},
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

export default Organization;

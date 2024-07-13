import nodemailer, { Transporter } from "nodemailer";
import { config } from "dotenv";
import React from "react";
import { render } from "@react-email/render";


import NovaVerification from "./templates/nova-verification";
import NovaWelcome from "./templates/nova-welcome";
import { Resend } from "resend";

config();



export class Mailer{
  sender: any 
  constructor(){
    this.sender= new Resend("re_VzJuw8hd_3McxZGtyxu1B63NWM6g2szyf")
  }

  async sendWelcomeEmail(receiver: string, details: any) {
    const { data, error } = await this.sender.emails.send({
      from: "Jalpha Health <info@jalphahealth.com>",
      to: [receiver],
      subject: "Welcome to Jalpha Health",
      html: render(<NovaWelcome name={details.name} user_name={details.user_name} password={details.password} type={details.type} slug={details.slug}/>),
    });

    if (error) {
      return {data: error, status: "FAILED" };
    }

    return {data: data, status:"SUCCESS" };
  }

  async sendVerifyEmail(receiver: string, name: string, code: string) {
    const { data, error } = await this.sender.emails.send({
      from: "Jalpha Health <info@jalphahealth.com>",
      to: [receiver],
      subject: "Verification Code",
      html: render(<NovaVerification name={name} verification_code={code} verification_link="" />),
    });

    if (error) {
      return {data: error, status: "FAILED" };
    }

    return {data: data, status:"SUCCESS" };
  }
};

export default Mailer
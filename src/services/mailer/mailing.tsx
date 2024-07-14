import { config } from "dotenv";
import React from "react";
import { render } from "@react-email/render";
import { Resend } from "resend";
import OTPEmail from "./templates/otp";
import OrganizationEmail from "./templates/organization";

config();



export class Mailer{
  sender: Resend
  from = "Bieba Auth <info@jalphahealth.com>"
  tagline = "Seamless Authentication"
  
  constructor(){
    this.sender= new Resend("re_VzJuw8hd_3McxZGtyxu1B63NWM6g2szyf")
  }

  private returnStatus (data: any, error: any) {
    if(error) {
      console.log(error)
      return {data: error, status: 'FAILED'}
    }
    console.log('Mailer Success')
    return {data, status: 'SUCCESS'};
  }

  async sendOTPEmail(receiver: string, otp: string | number) {
    const { data, error } = await this.sender.emails.send({
      from: this.from,
      to: [receiver],
      subject: this.tagline,
      html: render(<OTPEmail otp={otp} />)
    })

   return this.returnStatus(data, error)
  }


  async sendOrganizationEmail(receiver: string, id: string) {
    const { data, error } = await this.sender.emails.send({
      from: this.from,
      to: [receiver],
      subject: this.tagline,
      html: render(<OrganizationEmail orgID={id} />)
    })

    return this.returnStatus(data, error)
  }


};

export default Mailer
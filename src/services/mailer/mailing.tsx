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

  async sendOTPEmail(receiver: string, otp: string | number) {
    const { data, error } = await this.sender.emails.send({
      from: this.from,
      to: [receiver],
      subject: "Verification Code",
      html: render(<OTPEmail otp={otp} />)
    })

    if(error){
      return {data: error, status: "FAILED"}
    }

    return { data: data, status: "SUCCESS"}
  }


  async sendOrganizationEmail(receiver: string, id: string) {
    const { data, error } = await this.sender.emails.send({
      from: this.from,
      to: [receiver],
      subject: this.tagline,
      html: render(<OrganizationEmail orgID={id} />)
    })

    if(error){
      console.log({status: "FAILED"})
      console.log(error);
      return {data: error, status: "FAILED"}
    }
    
    console.log({status: "SUCCESS"})
    return { data: data, status: "SUCCESS"}
  }


};

export default Mailer
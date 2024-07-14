import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

const OTPEmail = ({ otp }: {otp: string | number}) => {
  return (
    <Html>
      <Head></Head>
      <Preview>Verification Code: {String(otp)}</Preview>
      <Tailwind>
        <Body style={main}>
          <Container style={container}>
            <Img
              alt="Simple HMS"
              width={60}
              height={60}
              style={{ objectFit: "contain" }}
              src={"https://i.ibb.co/thTsJqq/Svgjs-G1123.png"}
            />

            <Section style={box}>
              <Text style={title}>Verification Code</Text>
              <Text style={subtitle}>
                Please use the verification code below to verify your identity
              </Text>
              <section style={code}>
                {String(otp)
                  .split("")
                  .map((num) => (
                    <span key={`digit_${num}`} style={digit}>{num}</span>
                  ))}
              </section>
              <Text style={subtitle}>
                If you didn’t request a code, ignore this email or contact{" "}
                <Link href="https://example.com" style={link}>
                  support
                </Link>
              </Text>
            </Section>
            <Img
              alt="Simple HMS"
              width={235}
              height={143}
              style={{ objectFit: "contain" }}
              src={"https://i.ibb.co/12Lxhyq/email-logo.png"}
            />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default OTPEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    'Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 32px",
  marginBottom: "64px",
};

const box = {};

const title = {
  fontSize: "32px",
  fontWeight: "600",
  color: "black",
  marginBottom: "16px",
};

const subtitle = {
  color: "#4B5563",
  fontSize: "16px",
  lineHeight: "28px",
  marginBottom: "30px",
};

const code = {
  display: "flex",
  gap: "16px",
  alignItems: "center",
  marginBottom: "60px",
};

const digit = {
  padding: "10px 20px",
  borderRadius: "12px",
  backgroundColor: "#EEF2FF",
  color: "#4F46E5",
  fontWeight: 600,
  fontSize: "28px",
  marginRight: "8px",
};

const link = {
  color: "#4F46E5",
};

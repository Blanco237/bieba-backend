import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface NovaVerificationProps {
  verification_link: string
  verification_code?: string
  name?: string
}


export const NovaVerification = ({
  verification_link = 'https://nova-campus.de/my-account/?activate=1688822141%3A%24P%24BMXYyJfjEnlNg8RRFBrUs8iYx6wiyS.&suffix=yes',
  verification_code,
  name
}: NovaVerificationProps) => {
 const header_classname = "md:text-[3rem] text-[1rem] sm:text-[2.5rem] font-bold text-[#191919] leading-[120%] w-[450px] sm:w-full"
 const text_classname = "sm:text-[1.2rem] text-[0.8rem] md:text-[1.5rem] sm:text-[0.9rem] leading-[120%] text-[#191919] md:leading-[150%] w-[450px] sm:w-full text-justify"
 return (
      <Html>
        <Tailwind>
          <Head>
            <title>Verification Code</title>
          </Head>
          <Body
          className="my-auto mx-auto font-sans px-2 py-10 overflow-none w-[500px] sm:w-full"
            style={{
              backgroundImage: 'linear-gradient(to bottom, #015c81, #65838B)',
              backgroundRepeat: 'no-repeat',
              width: '100%'
            }}
          >
            <Img
              src={
                'https://iqbxfyumlvecsyljxogy.supabase.co/storage/v1/object/sign/jalpha_assests/svg/jalpha_logo.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJqYWxwaGFfYXNzZXN0cy9zdmcvamFscGhhX2xvZ28uc3ZnIiwiaWF0IjoxNzEzNDA5NDEyLCJleHAiOjIwMjg3Njk0MTJ9.wih596DVO1fFkhIEHlLdeXshMwnlpmN6_tY6st1JaUw&t=2024-04-18T03%3A03%3A36.520Zhttps://iqbxfyumlvecsyljxogy.supabase.co/storage/v1/object/sign/jalpha_assests/svg/jalpha_logo.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJqYWxwaGFfYXNzZXN0cy9zdmcvamFscGhhX2xvZ28uc3ZnIiwiaWF0IjoxNzEzNDA5NjYwLCJleHAiOjIwOTE4NDE2NjB9.BEQjRg_26-cdsmrytHyvZUrkeAcXft5-T1o-qB15lQ8&t=2024-04-18T03%3A07%3A44.427Z'
              }
              alt="JalphaHealth"
              className="my-0 mx-auto w-[25%] min-w-[100px] object-cover"
            />
            <Container className="px-[24px] md:px-[48px] w-[450px] bg-white rounded-3xl mx-auto my-4 py-[20px] sm:max-w-[500px] sm:max-w-[80%]">
              <Section className="md:pt-[36px] pt-[16px] w-[420px] sm:w-full">
                <Text className={`${header_classname}`}>
                  Verification Code
                </Text>
              </Section>
              <Row className="sm:text-[1.5rem] text-[0.8rem] text-base font-normal leading-[150%] pt-[0px] pb-[32px] flex flex-col gap-[16px] text-left w-full">
                <Text className={`${text_classname}`} key={1}>Hello {name}</Text>
                <Text className={`${text_classname}`} key={2}>You have requested for a change of password.</Text>
                <Text className={`${text_classname}`} key={3}>Below is you One Time Pin.</Text>
                <Text className={`${text_classname}`} key={4}>If you initiated this copy the code <strong className='underline'>{verification_code}</strong> and paste in the field</Text>
                <Text className={`${text_classname}`} key={5}><strong>If you didn't request this. Just ignore</strong></Text>
                <Text className={`${text_classname}`} key={6}>Your security is our priority</Text>
              </Row>
            </Container>
            <Text className="text-center mx-auto mt-[1.5rem] text-[#191919] sm:text-[1rem] text-[0.8rem]">Jalpha Health – 2023</Text>
          </Body>
        </Tailwind>
      </Html>
  );
};

export default NovaVerification;

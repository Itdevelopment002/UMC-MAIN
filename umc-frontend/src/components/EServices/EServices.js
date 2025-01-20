import React, { useState, useEffect, useRef } from "react";
import "./EServices.css";
import { Link } from "react-router-dom";
import img1 from "../../assets/images/project/img1 (1).png";
import img2 from "../../assets/images/project/img1 (2).png";
import img3 from "../../assets/images/project/img1 (3).png";
import img4 from "../../assets/images/project/img1 (4).png";
import tick from "../../assets/images/info/tick.png";
import plasticWaste from "../../assets/images/e-services/waste 1.png";
import swachhBharat from "../../assets/images/e-services/dustbin 1.png";
import airQuality from "../../assets/images/e-services/air-quality 1.png";
import rti from "../../assets/images/e-services/survey 2.png";
import employeeInfo from "../../assets/images/e-services/personal 1.png";

const EServices = () => {
  const [activeTab, setActiveTab] = useState("#umc-news");
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeInfoIndex, setActiveInfoIndex] = useState(null);


  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleClick = (index) => {
    setActiveIndex(index);
  };
  const handleInfoClick = (index) => {
    setActiveInfoIndex(index);
  };

  const tabData = [
    {
      id: "#umc-news",
      name: "UMC News",
      items: [
        {
          description: "Prebid Meeting Tender No-100 and 101",
          link: "https://drive.google.com/file/d/133-Jl5LPkuinO6iFmpo8SbXLdP465a-4/view?usp=drive_link"
        },
        {
          description: "Break the chain-Notice",
          link: "https://drive.google.com/file/d/1k-JMk4YYAgtT9Jc6_hDnsJr8HqU_dg4W/view?usp=drive_link"
        },
        {
          description: "Press Note",
          link: "https://drive.google.com/file/d/1eswnX5Tmy5CfrMW9LO0_Jvsi0G-Lew-D/view?usp=drive_link"
        },
        {
          description: "Press Note Ramjan",
          link: "https://drive.google.com/file/d/1kpEzcWSUMbbmaYoU-Y1olv30Z6e2ISMt/view?usp=drive_link"
        },
        {
          description: "Hanuman Jayanti Guideline",
          link: "https://drive.google.com/file/d/1kZxFEBvrZfuxHn6yUOk3Ylp1d9dqTTud/view?usp=drive_link"
        },
        {
          description: "Mahavir Jayanti Guideline",
          link: "https://drive.google.com/file/d/1Wm25nYjMjqwFj64AwXdK_zrTlr_zFrkY/view?usp=drive_link"
        },
        {
          description: "Ram Navmi Guideline",
          link: "https://drive.google.com/file/d/1d7wU0wGTTk4NgEydUazY1OVQtnqGltbQ/view?usp=drive_link"
        },
        {
          description: "Break The Chain Guideline 20-04-21.",
          link: "https://drive.google.com/file/d/1KDQDSgD2XFbkH24iYnkOg17iWpXoxar5/view?usp=drive_link"
        },
        {
          description: "Break The Chain Guideline 22-04-21.",
          link: "https://drive.google.com/file/d/1-UyQ7e1s__EZOPsXGU-yu1N5n8SwO_AJ/view?usp=drive_link"
        },
        {
          description: "Eligible Bidder for E-tender No- 635505_1.",
          link: "https://drive.google.com/file/d/1d1kcBKkh-Qf5N7ho-uiMN1NDSs-7uCfk/view?usp=drive_link"
        },
        {
          description: "Notice - Structural Audit of Buildings in UMC Area.",
          link: "https://drive.google.com/file/d/1ZhrHTP8Iu2jghoQOaOrz0VdNvcJljpcl/view?usp=drive_link"
        },
        {
          description: "Notice for Dangerous Buildings (Very Important).",
          link: "https://drive.google.com/file/d/1MibQlUNcIM0KyoaA7oL1gafhxWsh8mcM/view?usp=drive_link"
        },
        {
          description: "Voter List - Deletion.",
          link: "https://drive.google.com/file/d/1-5U8vT-LX_2JwR-_7hwgakaxnAg-t_cq/view?usp=drive_link"
        },
        {
          description: "श्री गणेश मुर्ती संकलन केंद्रांबाबत मार्गदर्शक सूचना (९ सप्टेंबर २०२१)",
          link: "https://drive.google.com/file/d/1RiGW0ymPmX6CCGGIce6vgJKhC1k-1-wJ/view?usp=drive_link"
        },
        {
          description: "घरगुती आणि सार्वजनिक श्री गणेशोत्सव २०२१ संदर्भात सर्वसमावेशक मार्गदर्शक सूचना.(०९ सप्टेंबर २०२१)",
          link: "https://drive.google.com/file/d/1sbVsPjthtiNJc0HGzRSYOYCuCpJcrAr0/view?usp=drive_link"
        },
        {
          description: "उल्हासनगर महानगरपालिका कार्यक्षेत्रामध्ये दिनांक २६/०९/२०२१ रोजी उप राष्ट्रीय पल्स पोलिओ लसीकरण मोहीम राबविणे बाबत.",
          link: "https://drive.google.com/file/d/1g83vhwjZLnRY08ZkTDf1_tRGH5K7xP0R/view?usp=drive_link"
        },
        {
          description: "सुधारित - कोविड-१९या कोरोना विषाणूमुळे उध्दभवलेल्या संसर्गजन्य रोगाचा प्रतिबंध व नियंत्रण करण्यासाठी ठोक मानधनावर ०६ महिन्यांसाठी तात्पुरती नियुक्ती करण्यासाठी उमेदवारांना मुलाखतीस बोलविण्यासाठी जाहिरात प्रसिद्धी.",
          link: "https://drive.google.com/file/d/1D_KhvDBFrTIFYcPR-lgAYEhAcRUBFVyj/view?usp=drive_link"
        },
        {
          description: "ब्रेक द चेन अंतर्गत सुधारित मार्गदर्शक सूचना - धार्मिक स्थळे/ प्रार्थना स्थळांच्या ठिकाणी कोविड़ १९ चा प्रादुर्भाव रोखण्यासाठी SOP",
          link: "https://drive.google.com/file/d/1kS5ieHT8Ur6BsKUYFwyIApxZ8L2dJZ3w/view?usp=drive_link"
        },
        // {
        //   description: "उल्हासनगर महानगरपालिका कार्यक्षेत्रातील कोरोना वार्तापत्र.",
        //   link: "#"
        // },
        {
          description: "उल्हासनगर शहरातील नागरीक /व्यापारी/दुकानदार यांना रस्त्यावरील खड्डे भरण्याच्या कामास सहकार्य करण्यासाठी आवाहन दि. ०७.११.२०२२.",
          link: "https://drive.google.com/file/d/1cp1k0knYdTbXXN8gvjqpiH-VFVkAAyMP/view?usp=drive_link"
        },
        {
          description: "स्थानिक स्वराज्य संस्थाच्या आगामी निवडणुकांतील उल्लेखनीय कामासाठी विविध स्थानिक स्वराज्य संस्था , स्वयंसेवी संस्था , अधिकारी / कर्मचारी , व्यक्ती इत्यादींना द्वितीय लोकशाही पुरस्काराने गौरवण्याबाबत .",
          link: "https://drive.google.com/file/d/1UUrGOgt_SasXW5bO2sy6lgfTzV0nEQGg/view?usp=drive_link"
        },
        {
          description: "भारत निवडणूक आयोग महाराष्ट्र विधान परिषदेच्या कोकण विभाग शिक्षक मतदारसंघाच्या मतदार यादया तयार करणे बाबत",
          link: "https://drive.google.com/file/d/1hpYjX33G9GWwadzanK4vxnr5UxtfUOcx/view?usp=drive_link"
        },
        {
          description: "अभय योजना २०२२ -२०२३&quot; जनजागृतीच्या अनुषंगाने उपाययोजना करणे.",
          link: "https://drive.google.com/file/d/1Fcc066LnsdMdlO0u5ZHcZjYT7JbUKS7x/view?usp=drive_link"
        },
        // {
        //   description: "महाराष्ट्र शासनाचे माझी वसुंधरा अभियान 3.0 आणि स्वच्छ सर्वेक्षण 2023 अभियानातंर्गत फटाकेमुक्त, प्लास्टिकमुक्त, कचरामुक्त, प्रदुषणमुक्त व पर्यावरणपुरक (ग्रीन फेस्टिवल) सण-उत्सव साजरे करणेबाबत.",
        //   link: "#"
        // },
        {
          description: "सेवानिवृत्त विकी कर अधिकारी/आयकर अधिकारी किंवा संनदी लेखापाल यांची सेवा करार पध्दतीने नियुक्ती करण्यासाठी.",
          link: "https://drive.google.com/file/d/1ifPBHLBHLjmSxImQ1Dl9POPG2E27Kyxg/view?usp=drive_link"
        },
        {
          description: "1-1-2022 अंतिम सेवा जेष्ठता यादी वर्ग - 4-20221007155756",
          link: "https://drive.google.com/file/d/1jsWwqPJOzY61gOz7yaiuQnHenvUwjsc1/view?usp=drive_link"
        },
        {
          description: "1-1-2022 अंतिम सेवा जेष्ठता यादी वर्ग - 4-20221007154119",
          link: "https://drive.google.com/file/d/1-yhf80H9g907ClADwfo2fb6Q92rgYgF7/view?usp=drive_link"
        },
        {
          description: "1-1-2022 अंतिम सेवा जेष्ठता यादी वर्ग - 2-20221007151923",
          link: "https://drive.google.com/file/d/1mLBUP-7KUjFj13MkMA0RWrnWImzxK-g8/view?usp=drive_link"
        },
        {
          description: "1-1-2022 अंतिम सेवा जेष्ठता यादी वर्ग - 1-20221007154507",
          link: "https://drive.google.com/file/d/1KZKMz6YzFPTDjZpycAWwxiqdBPY0Vqk-/view?usp=drive_link"
        },
        {
          description: "महापालिका आस्थापनेवर कार्यरत / कर्मचारी यांची संवर्ग १ २ ३ व संवर्ग ४ ची १ जानेवारी २०२२ अंतिम सेवाजेष्ठता यादी प्रसिद्ध करणेबाबत.",
          link: "https://drive.google.com/file/d/1Dcd1aVE6djLXQ73NfYCbVaX_aH958pIu/view?usp=drive_link"
        },
        // {
        //   description: "शासकीय निमशासकीय शेवानिवृत अभियंता (स्थापत्य / विद्युत ) अधिकाऱ्यांच्या सेवा करार पद्धतीने विवक्षित कामासाठी घेणेकरिता पात्र उमेदवारांना मुलाखतीस बोलावणेबाबत.",
        //   link: "#"
        // },
        {
          description: "उल्हासनगर महानगरपालिका कार्यक्षेत्रातील क्षयरुग्णांना मदत उपलब्ध करून देण्यासाठी उद्योगसमूह , स्वयंसेवा संख्या व दानशूरांनी पुढे यावे असे आवाहन उल्हासनगर महानगरपालिकेच्या वतीने करण्यात येत आहे.",
          link: "https://drive.google.com/file/d/1sHjDY_pXkH8CPJnSbmYyDRlR05T5DvGr/view?usp=drive_link"
        },
        {
          description: "महापालिकेच्या संकेतस्थळावर वाहनचालक पदावर पदोन्नती देण्याबाबत जाहिर सुचना व यादी / माहिती प्रसिध्द करणेबाबत.",
          link: "https://drive.google.com/file/d/1UoTw6jOcIaQlrPXeBSECWBpkLRy-dNcO/view?usp=drive_link"
        },
        {
          description: "सेवा निवृत्त लेखाधिकारी / सहा. लेखाधिकारी यांची सेवा करार पध्दतीने नियुक्ती करण्यासाठी.",
          link: "https://drive.google.com/file/d/1Rh4yynzdorODMHpr6CUJnDP5xHLKrJzB/view?usp=drive_link"
        },
        {
          description: "सेवानिवृत्त अधिकारी यांच्या सेवा एमपॅनेलमेंट केलेल्या १८ उमेदवारांची सेवा जेष्ठता सूची.",
          link: "https://drive.google.com/file/d/1Smk7M0agMT7ANqyo9k5XCNeqhN_S7Pri/view?usp=drive_link"
        },
        {
          description: "उल्हासनगर महानगरपालिका क्षेत्रातील अतिधोकादायक इमारतीबाबत जाहिर आवाह.",
          link: "https://drive.google.com/file/d/1qZPAZnf_KTwF9lAHxjZnmbsqUIQhBzhQ/view?usp=drive_link"
        },
        {
          description: "उल्हासनगर महानगरपालिका क्षेत्रातील दिव्यांग कल्याणकारी योजना बाबत.",
          link: "https://drive.google.com/file/d/1dswtpe0Xd6Dz60XWuIMV1s-l03lFSXM9/view?usp=drive_link"
        },
        {
          description: "उप राष्ट्रीय पल्स पोलिओ मोहिम दिनांक १८ सप्टेंबर, २०२२.",
          link: "https://drive.google.com/file/d/16fm-0m4VzDGzqrAjqg_xs0MmaABtdit3/view?usp=drive_link"
        },
        {
          description: "महानगपालिकेच्या संकेतस्थळावर अनुकंपा नियुक्तीबाबत प्रतीक्षा यादी.",
          link: "https://drive.google.com/file/d/1cH4fJMI5x-U979lqtG9wFpUiYkNSI3CT/view?usp=drive_link"
        },
        {
          description: "उल्हासनगर महानगरपालिका अंतर्गत कुष्ठरुग्ण , सक्रिय क्षयरुग्ण शोध मोहीम १३ सप्टेंबर २०२२ ते १६ सप्टेंबर २०२२ आणि २६ सप्टेंबर २०२२ ते ७ ऑक्टोबर २०२२ राबविण्यात येत आहे.",
          link: "https://drive.google.com/file/d/1hzF1K5zRxX4HE0czCljpxyNA8wd_4dKS/view?usp=drive_link"
        },
        {
          description: "उल्हासनगर महानगरपालिका पर्यावरण विभागातर्फे आंतरराष्ट्रीय शुद्ध हवा दिवस साजरा करण्या बाबत.",
          link: "https://drive.google.com/file/d/1L5qwYSlxrOqCRULDmSiYlGRCTSfdXmDE/view?usp=drive_link"
        },
        {
          description: "प्लास्टिक वापर बंधी बाबत जाहीर आवाहन.",
          link: "https://drive.google.com/file/d/1f_TiH95XReWMgzD-6-N8-O4CXFBE2CAQ/view?usp=drive_link"
        },
        {
          description: "पर्यावरण साजरिकर्णसाठी व पर्यावरणाची हानी टाळण्यासाठी आवाहन.",
          link: "https://drive.google.com/file/d/1_F6J1pNkXSZLqu3ufZ6IFyQTwT5cA3_V/view?usp=drive_link"
        },
        {
          description: "पर्यावरण साजरिकर्णसाठी व पर्यावरणाची हानी टाळण्यासाठी आवाहन.",
          link: "https://drive.google.com/file/d/1C6skaNFd5WeBvlI530La-t4eIDYSnOOy/view?usp=drive_link"
        },
        {
          description: "उल्हासनगर महानगरपालिका क्षेत्रातील विनापरवानगी अनधिकृत पोस्टर्स, बॅनर्स, होडींग, जाहिरात फलक इत्यादी न लावण्याबाबत जाहिर सूचना.",
          link: "https://drive.google.com/file/d/1dJs6AaM44e9wrzsPERZQt7LfhwKJzxXi/view?usp=drive_link"
        },
        {
          description: "उल्हासनगर महानगरपालिका ब्लिचिंग पावडर, ३३% क्लोरीन आय. एस. आय प्रमाणीत निर्जंतुकीकरणसाठी पुरवठा करून देण्याबाबत दरपत्रक नोटिस.",
          link: "https://drive.google.com/file/d/1iw5Qz6wemKeSvehhhZhS_AFmqUjphMgt/view?usp=drive_link"
        },
        {
          description: "स्वातंत्र्याचा अमृत महोत्सव अंतर्गत दिनांक १३ ऑगस्ट, २०२२ ते दिनांक १५ ऑगस्ट, २०२२ या कालावधीमध्ये स्वातंत्र्याचा महोत्सव अंतर्गत विविध उपक्रम/कार्यक्रम राबविण्या बाबत.",
          link: "https://drive.google.com/file/d/1GGWKimuJXG8sVA2SidRe3NCs-GWXoPWm/view?usp=drive_link"
        },
        {
          description: "भारतीय स्वातंत्र्याचा अमृत महोत्सव अंतर्गत हर घर तिरंगा उपक्रम राबविण्याबाबत.",
          link: "https://drive.google.com/file/d/1pS09uJPbLCEdB5h5jqsAOYq4MRBXenQY/view?usp=drive_link"
        },
        {
          description: "उल्हासनगर महानगरपालिका सार्वत्रिक निवडणूक २०२२ आरक्षण सोडत.",
          link: "https://drive.google.com/file/d/1ll6fjTVJO5ijd9nmVWx57u4Ri0BiNXPb/view?usp=drive_link"
        },
        // {
        //   description: "उल्हासनगर महानगरपालिका, उल्हासनगर जागतिक निसर्ग संवर्धन दिन साजरा करण्या बाबत",
        //   link: "#"
        // },
        {
          description: "महापालिका आस्थापनेवरील लिपीक / संगणकचालक या संवर्गातील मान्यता प्राप्त विद्यपीठाची कोणत्याही शाखेची पदवी किंवा समकक्ष अर्हता धारण करीत असलेल्या कर्मचार-यांची दिनांक १/१/२०२२ ची एकत्रित अंतिम यादी तयार करन्या बाबत",
          link: "https://drive.google.com/file/d/1PkvjsedQHdOuLlmdnUdVRZI7sw-twMEc/view?usp=drive_link"
        },
        {
          description: "उल्हासनगर महानगरपालिका वैद्यकीय आरोग्य विभागा अंतर्गत राष्ट्रीय शहरी आरोग्य अभियान व राष्ट्रीय क्षयरोग दूरीकरण कार्यक्रम (NTEP) अंतर्गत कंत्राटी तत्वावर रिक्त पदे भरन्या बाबत जाहिरात",
          link: "https://drive.google.com/file/d/1Up-PAbgqxVl-7P1U2mv5Mi5vaeahjeNI/view?usp=drive_link"
        },
        {
          description: "उल्हासनगर महानगरपालिका सार्वत्रिक निडणुक आरक्षण व सोडत कार्यक्रम दिनांक २९/०७/२०२२ रोजी आयोजित केला आहे.",
          link: "https://drive.google.com/file/d/1q7HzPZ_Hy2AmutfsUZdy_hSl5H5fXYwY/view?usp=drive_link"
        },
        {
          description: "सेवानिवृत्त अभियंता (स्थापत्य), सेवानिवृत्त अभियंता (विद्युत) तसेच सेवानिवृत्त अभियंता (मॅकॅनिक) या पदासाठी इच्छुक व पात्र उमेदवारांकडून अर्ज मागवणे बाबत",
          link: "https://drive.google.com/file/d/1JWlpYekcnoQHlLCL2kiiLzKKBGIRYCAj/view?usp=drive_link"
        },
        {
          description: "महापालिकेच्या संकेतस्थळावर मुकादम (बांधकाम) पदावर पदोन्नती देण्याबाबत जाहिर सुचना व यादी",
          link: "https://drive.google.com/file/d/1jUVA7YD_a_3I1p1bF8KQlfMUhsMRq9m6/view?usp=drive_link"
        },
        {
          description: "हर घर तिरंगा उपक्रमांतर्गत दिनांक १३ ते १५ ऑगस्टमध्ये प्रत्येकाने घरावर राष्ट्रध्वज फडकविण्याचे आयुक्तांचे आवाहन",
          link: "https://drive.google.com/file/d/1aNfJSvxbbj02m0At7NQtYQP_B85n4i6p/view?usp=drive_link"
        },
        {
          description: "उल्हासनगर महानगरपालिका आयोजित स्वातंत्र्याचा अमृत महोत्सव अंतर्गत हर घर झेंडा अभियान अंतर्गत रक्तदान शिबिर",
          link: "https://drive.google.com/file/d/1akD_iFayVhoX0OcrXIdLnFW8kkYX_sSA/view?usp=drive_link"
        },
        {
          description: "मा. आयुक्त, डॉ. राजा दयानिधी व अतिरिक्त आयुक्त, डॉ. करूणा जुईकर यांच्या मार्गदर्शनाखाली उल्हासनगर शहरातील मुर्तीकार/मुर्ती कारखानदार यांची महापालिकेच्या स्थायी समिती सभागृहात झालेल्या बैठकी बाबत",
          link: "https://drive.google.com/file/d/1FRn_V_fuvQq14Gdch5yCnRYqsFbZ9NsN/view?usp=drive_link"
        },
        {
          description: "उल्हासनगर महानगरपालिका आयोजित स्वातंत्र्याचा अमृत महोत्सव अंतर्गत हर घर झेंडा अभियान अंतर्गत रक्तदान शिबिर",
          link: "https://drive.google.com/file/d/1ZK1KmwGD1rFIzbx2pmlx4AKj5jW5u5bY/view?usp=drive_link"
        },
        {
          description: "उल्हासनगर महानगरपालिका क्षेत्रातील अतिधोकादायक इमारतीबाबत जाहिर आवाहन",
          link: "https://drive.google.com/file/d/1zQ4dtaGp1s9Oe0AjFfpv_WJf06aaU9rb/view?usp=drive_link"
        },
        {
          description: "उल्हासनगर महानगरपालिका क्षेत्रातील अनधिकृत बांधकामावर केलेल्या कारवाईची प्रभाग निहाय यादी (दिनांक- ८ जुलै २०२२)",
          link: "https://drive.google.com/file/d/1gc22PI8uNNAHUTbMQMoTO5C3ZtVIaKn3/view?usp=drive_link"
        },
        {
          description: "उल्हासनगर महानगरपालिका सार्वत्रिक निवडणूक २०२२ प्रारूप मतदार यादीबाबत जाहीर सूचना",
          link: "https://drive.google.com/file/d/1qYjb_Nax4NDj2T44cB81sSVBkiyCue26/view?usp=drive_link"
        },
        {
          description: "उल्हासनगर महानगरपालिका क्षेत्रातील अनधिकृत बांधकामे अतिक्रमणे यांचे विरुद्ध शहरातील नागरिकांना तक्रारी करणे सुलभ होणेकामी जाहीर सूचना",
          link: "https://drive.google.com/file/d/1CTVoiGryhDs9Simc0MI_9d8JrNwbHSk7/view?usp=drive_link"
        },
        {
          description: "उप राष्ट्रीय पल्स पोलिओ मोहिम दिनांक १९ जून,२०२२",
          link: "https://drive.google.com/file/d/1S8E1xV8Ujm1drjGxLnBsTUk8lUQYYEhX/view?usp=drive_link"
        },
        {
          description: "कोवीड १९ या आजारामुळे मृत्यु पावलेल्या व्यक्तींच्या निकट नातेवाईकास रु.५०,०००/- इतके सानुग्रह सहाय्य देण्याच्या योजनेसाठी अर्ज करणेबाबत.",
          link: "https://drive.google.com/file/d/1JPu1zS0bRiOgGtJi4i7L5B9Wc8axQVQi/view?usp=drive_link"
        },
        {
          description: "दिनांक ५ जुन २०२२ रोजी जागतिक पर्यावरण दिनानिमित्त उल्हासनगर महानगरपालिके मार्फत भाजी मार्केट क्र. १, भाजी मार्केट क्र. २. कृष्णा मंडळ येथील भाजी मार्केट, उल्हासनगर-४ येथे पर्यावरण जनजागृतीकरीता कापडी पिशव्यांचे वाटप",
          link: "https://drive.google.com/file/d/1Jb8QinaqYG2BzpiFQ4q-TJwp9mEJw4ns/view?usp=drive_link"
        },
        {
          description: "उल्हासनगर महानगरपालिका क्षेत्रात विनापरवानगी अनधिकृत पोस्टर्स, बॅनर्स, होडींग, जाहिरात फलक, पताका, झेंडे, कमानी, इत्यादी न लावण्याबाबत.",
          link: "https://drive.google.com/file/d/1tSdnx7FD2zuNRBZB10fItbFXFCMKeHiq/view?usp=drive_link"
        },
        {
          description: "उल्हासनगर महानगरपालिका सार्वत्रिक निवडणूक आरक्षण व सोडत कार्यक्रम २०२२",
          link: "https://drive.google.com/file/d/1AruIxmbXRFV94YZ9pzU8HUdVQTDW5G7c/view?usp=drive_link"
        },
        { description: "मुर्ती विसर्जनाबाबतची मार्गदर्शक तत्वे", link: "https://drive.google.com/file/d/1oHsta8F03eRCGSroRYlfZG4j6l1LTqLI/view?usp=drive_link" },
        // { description: "उल्हासनगर महानगरपालिका सार्वत्रिक निवडणून आरक्षण व सोडत कार्यक्रम २०२२", link: "#" },
        { description: "उल्हासनगर महानगरपालिका क्षेत्रातील शहर अभियंता (सार्वजनिक बांधकाम विभाग) यांनी फेरीवाला क्षेत्र म्हणून निश्चित केलेल्या 33 रस्त्यांची यादी", link: "https://drive.google.com/file/d/1f8y-FU8RKCKpDSWfSqNf3_qDZD3dr25w/view?usp=drive_link" },
        { description: "नागरिकांचे मत जाणून घेण्यासाठी महाराष्ट्र राज्यातील स्थानिक स्वराज्य संस्थामध्ये नागरिकांच्या मागास प्रवर्गास (ओबीसी, व्हीजे एनटी) आरक्षणासाठी घटित केलेल्या समर्पित आयोगाच्या भेटीच्या कार्यक्रमबाबत", link: "https://drive.google.com/file/d/1WfxyCSn-oRy1Vc3wmdh2HklUv_NWvt5q/view?usp=drive_link" },
        { description: "उल्हासनगर महानगरपालिका क्षेत्रातील धोकादायक बांधकामे/इमारतींची यादी", link: "https://drive.google.com/file/d/1Yu5EJ6TC242NW5aVFlBuuvYTSVoF3RHV/view?usp=drive_link" },
        { description: "उल्हासनगर महानगरपालिका क्षेत्रातील अतिधोकादायक इमारती बाबत जाहिर आवाहन", link: "https://drive.google.com/file/d/1WMsoEAr_Lz-OsvlmrvDAt7FEeDQcRj3l/view?usp=drive_link" },
        { description: "उल्हासनगर महानगरपालिका वैद्यकिय आरोग्य विभाग अंतर्गत राष्ट्रीय शहरी आरोग्य अभियान कार्यक्रम (NUHM) अंतर्गत औषध निर्माता, स्टाफ नर्स, प्रसविका व प्रयोगशाळा तंत्रज्ञ (पूर्ण वेळ) (Pharma, Gnm Anim & LT Full Time) कंत्राटी तत्वावर रिक्त पदे भरणेसाठी दिनांक १३/०५/२०२२ रोजी घेण्यात आलेल्या थेट मुलाखतीची सर्वसाधारण गुणवत्ता यादी", link: "https://drive.google.com/file/d/1GibglArD8hqL9Q0185s-mXLqqFqyHbSW/view?usp=drive_link" },
        { description: "उल्हासनगर महानगरपालिका वैद्यकिय आरोग्य विभाग अंतर्गत राष्ट्रीय शहरी आरोग्य अभियान कार्यक्रम (NUHM) अंतर्गत कंत्राटी तत्वावर औषध निर्माता (Pharmaist), स्टाफ नर्स (Staff Nurse). प्रयोगशाळा चाचणी तंत्रज्ञ. (Lab Technician) व सहाय्यक परिचारीका प्रसाविका (ANM) रिक्त पदे भरण्यासाठी दि. २५/०४/२०२२ ते दि २८/०४/२०२२ पर्यंत प्राप्त अर्जांची छाननीनुसार पात्र व अपात्र उमेदवारांची यादी", link: "https://drive.google.com/file/d/1mCthuQGB2OMktE0C4Ux1j0T6-BGnBw8q/view?usp=drive_link" },
        { description: "वैद्यकिय आरोग्य विभाग अंतर्गत राष्ट्रीय शहरी आरोग्य अभियान कार्यक्रम (NUHM) कंत्राटी तत्वावर विविध पदांसाठी दि. २५/०४/२०२२ ते दि २८/०४/२०२२ पर्यंत प्राप्त अर्जानुसार पात्र उमेदवारांपैकी दि.१३-०५-२०२२ रोजी मुलाखतीस बोलविण्यात आलेल्या उमेदवारांची यादी.", link: "https://drive.google.com/file/d/1qYvdQrPHWxuyHU8GeL1NWOUtFde2JRux/view?usp=drive_link" },
        { description: "धोकादायक इमारतीचा अहवाल (दि. 9.05.2022)", link: "https://drive.google.com/file/d/1ykuvh5qj62GA9uxa5eu_3cwG09b_wBeb/view?usp=drive_link" },
        { description: "उल्हासनगर महानगरपालिका वैद्यकिय आरोग्य विभाग अंतर्गत राष्ट्रीय शहरी आरोग्य अभियान कार्यक्रम (NUHM) अंतर्गत कंत्राटी तत्वावर रिक्त पदे भरण्यासाठी थेट मुलाखत (walk in interview) चे वेळापत्रक", link: "https://drive.google.com/file/d/1hf-94Y2-8QzOiX49Rsjpt6IoFOR3qi6E/view?usp=drive_link" },
        { description: "उल्हासनगर महानगरपालिका वैद्यकिय आरोग्य विभाग अंतर्गत राष्ट्रीय शहरी आरोग्य अभियान कार्यक्रम (NUHM) अंतर्गत कंत्राटी तत्वावर वैद्यकिय अधिकारी (पूर्ण वेळ) (NUHM) (MO. FullTime) सर्वसाधारण गुणवत्ता यादी दि. 05.05.2022", link: "https://drive.google.com/file/d/1VkAfXozYqiJ6Q-YStc4F1aau7b-0tSHD/view?usp=drive_link" },
        { description: "उल्हासनगर महानगरपालिकेच्या सार्वजनिक बांधकाम विभागामार्फत निश्चित करण्यात आलेल्या फेरीवाला क्षेत्राबाबत जाहीर सुचना", link: "https://drive.google.com/file/d/1WzXxiWZSXUjnh89V94E4vjRPtV4JQHtn/view?usp=drive_link" },
        { description: "Covid-19 प्रतिबंधात्मक उपाययोजना नियुक्तीसाठी पात्र उमेदवारांची गुणवत्ता यादी ( तात्पुरत्या स्वरूपात विविध वैद्यकीय अधिकारी) दिनांक - २८ एप्रिल २०२२", link: "https://drive.google.com/file/d/1Zg7kra9ZWKzG4yJTRlDmOhuYxYrKyczR/view?usp=drive_link" },
        { description: "उल्हासनगर महानगरपालिका क्षेत्रातील धोकादायक व अतिधोकादायक इमारतीबाबत जाहिर आवाहन (दि. 28.04.2022)", link: "https://drive.google.com/file/d/1J-Pv346cpLHyRUEBhQs7aDPai7VKDxe4/view?usp=drive_link" },
        { description: "उल्हासनगर महानगरपालिका क्षेत्रातील अतिधोकादायक इमारतीबाबत जाहिर आवाहन व प्रसिध्दी पत्रक", link: "https://drive.google.com/file/d/1KF2D6SVOEQtPyh02vwdBL9HmD0eweTR2/view?usp=drive_link" },
        { description: "उल्हासनगर महानगरपालिका वैद्यकिय आरोग्य विभाग अंतर्गत राष्ट्रीय शहरी आरोग्य अभियान कार्यक्रम (NUHM) अंतर्गत कंत्राटी तत्वावर रिक्त पदे भरणेबाबत शुद्धीपत्रक", link: "https://drive.google.com/file/d/15zBXh-OfikPePaEEtUqTZBQoft0NOtk5/view?usp=drive_link" },
        { description: "उल्हासनगर महानगरपालिका वैद्यकिय आरोग्य विभाग अंतर्गत राष्ट्रीय शहरी आरोग्य अभियान कार्यक्रम (NUHM) अंतर्गत कंत्राटी तत्वावर रिक्त पदे भरणेबाबत.", link: "https://drive.google.com/file/d/1ZSiFLa3L16P8X4qERIINQf9LFY3WeBJL/view?usp=drive_link" },
        { description: "कोविड-१९ या कोरोना विषाणुमुळे उध्दभवलेल्या संसर्गजन्य रोगाचा प्रतिबंध व नियंत्रण करण्यासाठी ठोक मानधनावर ०६ महिन्यासाठी तात्पुरती नियुक्ती करण्यासाठी उमेदवाराना मुलाखतीस बोलविण्यासाठी शुध्दीपत्रक प्रसिध्द करणेबाबत.", link: "https://drive.google.com/file/d/15tv50lMBqMcBbhZJcYoguLNVZE3DxoZX/view?usp=drive_link" },
        { description: "कोविड-१९ या कोरोना विषाणुमुळे उध्दभवलेल्या संसर्गजन्य रोगाचा प्रतिबंध व नियंत्रण करण्यासाठी ठोक मानधनावर ०६ महिन्यासाठी तात्पुरती नियुक्ती करण्यासाठी उमेदवाराना मुलाखतीस बोलविण्यासाठी जाहिरात", link: "https://drive.google.com/file/d/1hJbfxGoVHEAU4Jj12f53j24Jh7TMaXcM/view?usp=drive_link" },
        // { description: "Expression of interest regarding implementation at property tax system at ulhasnagar municipal corporation", link: "#" },
        {
          description: "Property tax Recovery in Abhay Yojana dated 16th to 31st March 2022",
          link: "https://drive.google.com/file/d/1jtgn-gcVHYn5hr1ERcZ05vwcPVLPlgX8/view?usp=drive_link"
        },
        {
          description: "Abhay yojna decleration 2022.",
          link: "https://drive.google.com/file/d/17nefPj_VtV15d5t1YibUROPxevfymk_s/view?usp=drive_link"
        },
        {
          description: "होळी, धुलिवंदन व रंगपंचमी- २०२२ मार्गदर्शक सूचना",
          link: "https://drive.google.com/file/d/1XKqJ8Gf1mawZ3rTjP1nV7LNCb5N1y7nU/view?usp=drive_link"
        },
        {
          description: "उल्हासनगर महानगरपालिका माझी वसुंधरा अभियान अंतर्गत सायक्लोथाॅन 2022",
          link: "https://docs.google.com/forms/d/e/1FAIpQLScrZRGydGVNqeAxoTbVrBDAsYBAM8figC0LUyMwRwMDPBUvaw/viewform"
        },
        {
          description: "राष्ट्रीय पल्स पोलिओ मोहीम दिनांक २७ फेब्रुवारी २०२२ संदर्भात प्रेस नोट",
          link: "https://drive.google.com/file/d/1-stl3jgH2z_Hqlbg0sUgLrnbKjvn2ewW/view?usp=drive_link"
        },
        {
          description: "उमपा सार्वत्रिक निवडणूक २०२२ - आक्षेपदार निहाय सविस्तर वेळापत्रक",
          link: "https://drive.google.com/file/d/14Ok_66K8ue0WTvVPTlzKnCjmdwa2ZLYw/view?usp=drive_link"
        },
        {
          description: "छत्रपती शिवाजी महाराज जयंती २०२२ मार्गदर्शक सूचना",
          link: "https://drive.google.com/file/d/1pdvu1Kb1U7Gxwx3f91bBEc3QBGp7Ahwz/view?usp=drive_link"
        },
        {
          description: "(महानगरपालिका सार्वत्रिक निवडणूक -२०२२)- प्रारुप प्रभागांच्या भौगोलिक सीमा प्रसिद्धी - जाहीर सूचनेचा नमुना -मराठी आणि इंग्रजी मध्ये",
          link: "https://drive.google.com/file/d/19Op-zTcIiKFHW28WB44OUWb2vrRul7As/view?usp=drive_link"
        },
        {
          description: "उल्हासनगर महानगपालिका क्षेत्रातील शैक्षणिक वर्ष २०२१-२२ मध्ये सर्व व्यवस्थापनाचे, सर्व माध्यमांचे पूर्व प्राथमिक तसेच इयत्ता १ ली ते इयत्ता १२ वी चे वर्ग दि. २४/०१/२०२२ पासून सुरु करणेबाबत.",
          link: "https://drive.google.com/file/d/14-d9S8WIcuE7UHwoLl1C_FoGFiUNCM_g/view?usp=drive_link"
        },
        {
          description: "कोरोना विषाणूमुळे उद्भवलेल्या संसर्गजन्य रोगाचा प्रतिबंध व नियंत्रण आणणेसाठी उल्हासनगर महानगरपालिका क्षेत्रामध्ये प्रतिबंध लादणेबाबत सुधारित मार्गदर्शक सूचना - १० जानेवारी २०२२",
          link: "https://drive.google.com/file/d/1OkHWBkFpP_BrZwGA6uXkn1FZEKwiftri/view?usp=drive_link"
        },
        {
          description: "Medical Health Department - PressNote - 07 JAN 22",
          link: "https://drive.google.com/file/d/1jHRCRyeHBw3xSMeRE9JLDG9sh0dbAXCO/view?usp=drive_link"
        },
        {
          description: "सुधारित बडतर्फ आदेश - ०६ जानेवारी २०२२",
          link: "https://drive.google.com/file/d/1nBLFBT8CI1u2trku6sUm9nKg88Lf437v/view?usp=drive_link"
        },
        {
          description: "कोरोना विषाणूमुळे उद्भवलेल्या संसर्गजन्य रोगाचा प्रतिबंध व नियंत्रण आणणेसाठी उल्हासनगर महानगरपालिका क्षेत्रामध्ये प्रतिबंध लादणेबाबत सुधारित मार्गदर्शक सूचना - 31 December 2021",
          link: "https://drive.google.com/file/d/1QqX88Z2NqAyZ57akmW4rDvH7ak38_SiG/view?usp=drive_link"
        },
        {
          description: "दिनांक - ४/१०/२०२१ व ५/१०/२०२१ रोजी ०६ महिन्यासाठी कंत्राटी तत्वावर नियुक्ती करणेकरीता मुलाखती घेतलेल्या उमेदवारांची निवड यादी व प्रतिक्षा यादी . (दिनांक - ३० डिसेंबर २०२१ रोजी प्रसिद्धीस)",
          link: "https://drive.google.com/file/d/1UvZE2GZ9cGJzHTgUt8XMuBsIvtIXTU-A/view?usp=drive_link"
        },
        {
          description: "कोरोना विषाणूमुळे उद्भवलेल्या संसर्गजन्य रोगाचा प्रतिबंध व नियंत्रण आणणेसाठी उल्हासनगर महानगरपालिका क्षेत्रामध्ये प्रतिबंध लादणेबाबत सुधारित मार्गदर्शक सूचना - 27 December 2021",
          link: "https://drive.google.com/file/d/1RC7nm-9aApFy38gIRUBIF5mwaG6ljojy/view?usp=drive_link"
        },
        {
          description: "शैक्षणिक वर्ष २०२१-२२ मध्ये उल्हासनगर महानगरपालिका क्षेत्रातील इयत्ता १ ली ते ७ वी च्या च्या शाळांचे वर्ग सुरक्षितपणे सुरु करणेबाबत. - 22 December 2021",
          link: "https://drive.google.com/file/d/1azUeaLwf-6e9B-JO7vyq2la-6eju2hlo/view?usp=drive_link"
        },
        {
          description: "शैक्षणिक वर्ष २०२१-२२ मध्ये उल्हासनगर महानगरपालिका क्षेत्रातील इयत्ता १ ली ते ७ वी च्या च्या शाळांचे वर्ग सुरक्षितपणे सुरु करणेबाबत.",
          link: "https://drive.google.com/file/d/1Z_L9b7KNoFiNHcamY2MJ9msyVBAZ5JMG/view?usp=drive_link"
        },
        {
          description: "कोवीड-१९ लसीकरण कार्यक्रमांतर्गत दुसरी मात्रा लसीकरण न झालेल्या लाभार्थींना नागरी सुविधा केंद्रामार्फत SMS पाठविण्याची व्यवस्था करणेबाबत.",
          link: "https://drive.google.com/file/d/1AY-dl0Jl9Iv9PreN49_427G7-kvOGyFz/view?usp=drive_link"
        },
        // {
        //   description: "बडतर्फ आदेश - ०७ डिसेंबर २०२१",
        //   link: "#"
        // },
        {
          description: "कोरोना विषाणूमुळे उद्भवलेल्या संसर्गजन्य रोगाचा प्रतिबंध व नियंत्रण आणणेसाठी उल्हासनगर महानगरपालिका क्षेत्रामध्ये प्रतिबंध लादणेबाबत सुधारित मार्गदर्शक सूचना २९ नोव्हेंबर २०२१",
          link: "https://drive.google.com/file/d/14tniTl38TdW3iI41Th3wCDZ2C_A4t-Bk/view?usp=drive_link"
        },
        {
          description: "ब्रेक द चेन अंतर्गत सुधारित मार्गदर्शक सूचना . धार्मिक स्थळे / प्रार्थना स्थळे ज्येष्ठ नागरिक व गरोदर माता यांच्याकरिता खुली करणेबाबत. (परिपत्रक दि. १२ नोव्हेंबर, २०२१)",
          link: "https://drive.google.com/file/d/1L9Zuj0wewupgSznnRg1D7i0DucSpRL1F/view?usp=drive_link"
        },
        {
          description: "उल्हासनगर महानगरपालिका महिला व बाल कल्याण विभागामार्फ़त दिनांक १५/११/२०२१ पासून महानगरपालिका हद्दीतील महिला व मुलीं करिता विविध विषयांचे प्रशिक्षण सुरु करण्यात येत असल्याने इच्छुक असलेल्या प्रशिक्षणार्थ्यानी अर्ज विहित नमुन्यात (१५)दिवसांत सादर करणे करिता जाहिरात प्रसिद्ध करण्यात येत आहे.",
          link: "https://drive.google.com/file/d/1PIeJ0UeYF_0QW1vp9jEZllqK4OLkTArV/view?usp=drive_link"
        },
        {
          description: "ब्रेक द चेन अंतर्गत सुधारित मार्गदर्शक सूचना २०२१ उ.म.पा. - 09 नोव्हेंबर २०२१",
          link: "https://drive.google.com/file/d/1fKBzuQ4l271Vasvc_P-fGcTFDYsyND25/view?usp=drive_link"
        },
        {
          description: "छठपूजा मार्गदर्शक सूचना २०२१ उ.म.पा. - 09 नोव्हेंबर २०२१",
          link: "https://drive.google.com/file/d/17ATismq-i0_dWIEUB-f04iSOhKoF7knf/view?usp=drive_link"
        },
        {
          description: "छठपूजा मार्गदर्शक सूचना २०२१ उ.म.पा. - 08 नोव्हेंबर २०२१",
          link: "https://drive.google.com/file/d/1uvcMwT9TKwz2tGCcE6gjpYt19aSlziwa/view?usp=drive_link"
        },
        {
          description: "दिपावली उत्सव २०२१ संदर्भात सर्वसमावेशक मार्गदर्शक सूचना. - ०३ नोव्हेंबर २०२१",
          link: "https://drive.google.com/file/d/1D4mzZ7CRDVh9djz-hpe_z5USGjy_Suym/view?usp=drive_link"
        },
        {
          description: "दिपावली उत्सव २०२१ संदर्भात सर्वसमावेशक मार्गदर्शक सूचना. - ०२ नोव्हेंबर २०२१",
          link: "https://drive.google.com/file/d/1N0ZWPlF45wu8uSUcYj9ZIMF04i08sHuW/view?usp=drive_link"
        },
        {
          description: "दीपावली उत्सव २०२१ संदर्भात सर्वसमावेशक मार्गदर्शक सूचना. - ०१ नोव्हेंबर २०२१",
          link: "https://drive.google.com/file/d/1BgjivLulASdJbSvMIKGhH-3yf7MLiDpm/view?usp=drive_link"
        },
        {
          description: "दिपावली मार्गदर्शक सूचना २०२१ उ.म.पा. - २१ ऑक्टोबर २०२१",
          link: "https://drive.google.com/file/d/1IAOlUQ1lw-Jzwg4cf_Z7gdO_9ajNKhNa/view?usp=drive_link"
        },
        {
          description: "धोकादायक / अतिधोकादायक घोषित करण्यात आलेल्या इमारतीची प्रभाग समिती निहाय यादी - २१ ऑक्टोबर २०२१",
          link: "https://drive.google.com/file/d/1LfvPiZ7h8MSLROS680WupoH2_oMHRSnw/view?usp=drive_link"
        },
        {
          description: "जीआयएस आधारीत मालमत्तांचे सर्वेक्षण करणेबाबतची माहिती पुस्तिका - २१ ऑक्टोबर २०२१",
          link: "https://drive.google.com/file/d/1ZkvagYFb_u69zJXJcQFPg-m-WTXcRaWx/view"
        },
        {
          description: "प्रसिद्धीपत्रक (प्रेसनोट) - मालमत्ता कर विभाग - २० ऑक्टोबर २०२१",
          link: "https://drive.google.com/file/d/1HZdOLKL1ITBnlSg0s8FZ2qAwOSHJffew/view?usp=drive_link"
        },
        {
          description: "अनुकंपा तत्वावर नियुक्तीबाबत भरती वर्ष २०२०-२०२१ प्रारूप प्रतिक्षा यादी",
          link: "https://drive.google.com/file/d/1UhRhSmsfz2PabnCziDlPVCBRofgVs-yK/view?usp=drive_link"
        },
        {
          description: "ईद-ए-मिलाद (मिलादुन नबी) २०२१ संदर्भात सर्वसमावेशक सूचना - १८ ऑक्टोबर २०२१",
          link: "https://drive.google.com/file/d/1Y05PEAWQcBTYT9VWeir1cVibcDwR12Xv/view?usp=drive_link"
        },
        {
          description: "देवी मूर्ती संकलन केंद्रांची माहिती - १४ ऑक्टोबर २०२१",
          link: "https://drive.google.com/file/d/1c1TF3QbzjUv8HWZSN0cKWEHkmRZ_rD07/view?usp=drive_link"
        },
        {
          description: "देवी मूर्ती संकलन केंद्रांची माहिती - १३ ऑक्टोबर २०२१",
          link: "https://drive.google.com/file/d/1t1u7rSoVT1qKEaa1Nnq0YZg6yuSAfian/view?usp=drive_link"
        },
        {
          description: "कोविड-१९ च्या पार्श्ववभूमीवर \"ब्रेक दी चेन\" अंतर्गत नाट्यगृहे, चित्रपटगृहे सभागृहे/ मोकळ्या जागेत होणारे इतर सांस्कृतिक कार्यक्रम पुन्हा सुरु करण्याबाबत मार्गदर्शक तत्वे",
          link: "https://drive.google.com/file/d/1eEpjNQptvK2_kj_z3unkQenCBmSrBEBo/view?usp=drive_link"
        },
        {
          description: "देवी मूर्ती संकलन केंद्रांची माहिती -११ ऑक्टोबर २०२१",
          link: "https://drive.google.com/file/d/1VJ_goDRqJKzM8vQ-o-X02mXpUrBhYt-n/view?usp=drive_link"
        },
        {
          description: "मताधिकार जागृतीसाठी लोकशाही भोंडला स्पर्धाचे प्रसिद्धीपत्रक",
          link: "https://drive.google.com/file/d/1IRBtvE0je2nbR6yHx1dNflH4B2yCb1tw/view?usp=drive_link"
        },
        {
          description: "सेंचुरी रेयॉन शाळा लसीकरण केंद्राचे ०८-१०-२१ रोजी कोविड लसीकरण रद्दझाल्या बद्दल - प्रेसनोट",
          link: "https://drive.google.com/file/d/1JdtUxabg4Y7f7a1Qk-pbV2eni_T8SlSL/view?usp=drive_link"
        },
        {
          description: "कोरोना (कोविड १९) प्रादुर्भाव रोखण्यासाठी प्रतिबंधात्मक उपाययोजना करण्याकरिता कंत्राटी तत्त्वावर ६ महिन्यासाठी दिनांक ६/१०/२१ ते ८/१०/२१ रोजी आयोजित करण्यात आलेली थेट मुलाखत प्रशासकीय कारणास्तव संस्थगित करण्यात आली असून सदर भरतीबाबतचे सुधारीत वेळापत्रक महापालिकेच्या संकेतस्थळावर प्रसिध्द करण्यात येईल ह्याची सर्वांनी नोंद घेऊन महानगरपालिका प्रशासनास सहकार्य करण्यात यावे, ही विनंती.",
          link: "https://drive.google.com/file/d/1fjR8uQ6xc-xnh0ERj5dBlUlKVBq56wBb/view?usp=drive_link"
        },
        {
          description: "Walk-in-interview प्रशासनिक कारणास्तव संस्थगित करण्यात आलेबद्दल - प्रेसनोट",
          link: "https://drive.google.com/file/d/1PHrG16t2UGzszMwA0LMS53vp79iIVf2J/view?usp=drive_link"
        },
        {
          description: "सार्वजनिक व घरगुती नवरात्रौत्सव २०२१ संधर्भात सर्वसमावेशक मार्गदर्शक सूचना",
          link: "https://drive.google.com/file/d/1zXXU-RfGrYRKFOOUq4Z_5XCAiZ7mbbpz/view?usp=drive_link"
        },
        {
          description: "ब्रेक द चेन अंतर्गत सुधारित मार्गदर्शक सूचना - धार्मिक स्थळे/ प्रार्थना स्थळांच्या ठिकाणी कोविड़ १९ चा प्रादुर्भाव रोखण्यासाठी SOP",
          link: "https://drive.google.com/file/d/1kS5ieHT8Ur6BsKUYFwyIApxZ8L2dJZ3w/view?usp=drive_link"
        },
        {
          description: "सुधारित - कोविड-१९या कोरोना विषाणूमुळे उध्दभवलेल्या संसर्गजन्य रोगाचा प्रतिबंध व नियंत्रण करण्यासाठी ठोक मानधनावर ०६ महिन्यांसाठी तात्पुरती नियुक्ती करण्यासाठी उमेदवारांना मुलाखतीस बोलविण्यासाठी जाहिरात प्रसिद्धी",
          link: "https://drive.google.com/file/d/1D_KhvDBFrTIFYcPR-lgAYEhAcRUBFVyj/view?usp=drive_link"
        },
        // {
        //   description: "कोविड-१९या कोरोना विषाणूमुळे उध्दभवलेल्या संसर्गजन्य रोगाचा प्रतिबंध व नियंत्रण करण्यासाठी ठोक मानधनावर ०६ महिन्यांसाठी तात्पुरती नियुक्ती करण्यासाठी उमेदवारांना मुलाखतीस बोलविण्यासाठी जाहिरात प्रसिद्धी",
        //   link: "#"
        // },
        {
          description: "उल्हासनगर महानगरपालिका कार्यक्षेत्रामध्ये दिनांक २६/०९/२०२१ रोजी उप राष्ट्रीय पल्स पोलिओ लसीकरण मोहीम राबविणे बाबत.",
          link: "https://drive.google.com/file/d/1g83vhwjZLnRY08ZkTDf1_tRGH5K7xP0R/view?usp=drive_link"
        },
        {
          description: "Click Here to know about quotations/tender related news and notices only as per provided by the concern departments.",
          link: "https://creatorkart.com/UMC_Frontend-New/quotation"
        },
        {
          description: "घरगुती आणि सार्वजनिक श्री गणेशोत्सव २०२१ संदर्भात सर्वसमावेशक मार्गदर्शक सूचना.(०९ सप्टेंबर २०२१)",
          link: "https://drive.google.com/file/d/1sbVsPjthtiNJc0HGzRSYOYCuCpJcrAr0/view?usp=drive_link"
        },
        {
          description: "श्री गणेश मुर्ती संकलन केंद्रांबाबत मार्गदर्शक सूचना (९ सप्टेंबर २०२१)",
          link: "https://drive.google.com/file/d/1RiGW0ymPmX6CCGGIce6vgJKhC1k-1-wJ/view?usp=drive_link"
        },
        {
          description: "श्री गणेश मुर्ती संकलन केंद्रांबाबत मार्गदर्शक सूचना (८ सप्टेंबर २०२१)",
          link: "https://drive.google.com/file/d/1mu2QD_ZJEiAZ-49UWS6cHElscw9GLUfQ/view?usp=drive_link"
        },
        {
          description: "घरघुती आणि सार्वजनिक श्री गणेशोत्सव २०२१ संदर्भात सर्व समावेशक मार्गदर्शक सूचना. दिनांक - ८ सप्टेंबर २०२१",
          link: "https://drive.google.com/file/d/15qkBY3jJblhip-_T3C8k51iD1JZ-JbR_/view?usp=drive_link"
        },
        {
          description: "घरघुती आणि सार्वजनिक श्री गणेशोत्सव 2021 संदर्भात सर्व समावेशक मार्गदर्शक सूचना. दिनांक - ७ सप्टेंबर २०२१",
          link: "https://drive.google.com/file/d/1SnxQmYCofORbJ0B357timvwJsKgd6QXD/view?usp=drive_link"
        },
        {
          description: "घरघुती आणि सार्वजनिक श्री गणेशोत्सव 2021 संदर्भात सर्व समावेशक मार्गदर्शक सूचना. दिनांक - ६ सप्टेंबर २०२१",
          link: "https://drive.google.com/file/d/1NeQDCgYTGOMSQpRwraDKBzQDezi6u8QY/view?usp=drive_link"
        },
        {
          description: "घरघुती आणि सार्वजनिक श्री गणेशोत्सव 2021 संदर्भात सर्व समावेशक मार्गदर्शक सूचना.",
          link: "https://drive.google.com/file/d/11QGirGI7u9V5qHhJXORqwv0NnjRPiIXs/view?usp=drive_link"
        },
        {
          description: "महापालिकेच्या संकेतस्थळावर वरिष्ठ लिपिक पदावर पदोन्नती देण्याबाबत जाहीर सुचना व यादी/माहिती प्रसिद्ध करणेबाबत. वर्ष सप्टेंबर २०२१",
          link: "https://drive.google.com/file/d/1Os4eRcyaLaL76RxxX-D8VLhysUcU4tMV/view?usp=drive_link"
        },
      ],
    },
    {
      id: "#initiatives",
      name: "Initiatives-Programme",
      layout: true,
    },
    {
      id: "#e-services",
      name: "e-Services",
      layout: true,
    },
    {
      id: "#election",
      name: "Election",
    },
  ];

  // const eServicesLayout = [
  //   "Property Tax",
  //   "Birth Certificate",
  //   "Death Certificate",
  //   "e-Tenders",
  //   "Aaple Sarkar",
  //   "Aaple Sarkar Grievance Redressal Portal",
  //   "Water Tax",
  //   "Building Plan Management System",
  //   "Pandal Permission",
  // ];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const projects = [
    {
      id: 1,
      heading: "Ulhasnagar-04,",
      description: "at Netaji Chowk, near Kailash Colony, Kurla Camp, construction of a cement concrete road.",
      img: img1,
    },
    {
      id: 2,
      heading: "Ulhasnagar-05,",
      description: "near the English High School, behind Lalchhaki Petrol Pump and Hill Line Police Station, construction of a cement concrete road.",
      img: img2,
    },
    {
      id: 3,
      heading: "Ulhasnagar-01,",
      description: "at A-Block, near Saibaba Temple, Delphine club and century ground, construction of a cement concrete road.",
      img: img3,
    },
    {
      id: 4,
      heading: "Ulhasnagar-04,",
      description: "From Sonar Chowk to Koyande, Sharda Camp, construction of a cement concrete road.",
      img: img4,
    },
  ];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const information = [
    { description: "Action Against Illegal Construction (1st July to 31st December 2020)", link: "https://drive.google.com/file/d/18MZleh2FJBHXdJBQqPcS1HJgggkHZqhK/view?usp=drive_link" },
    { description: "Regularization of Unauthorized Structures", link: "https://drive.google.com/file/d/1jg9u-D3BwFP0k6w26gjAt0DDq4s9ScW1/view?usp=drive_link" },
    { description: "Pollution Control Helpline: 18002331103", link: "https://drive.google.com/file/d/18mMgTmGmafEl8YyxciRTsu1T1nwCOAGP/view?usp=drive_link" },
    { description: "Recycle Water Provision in DCR", link: "https://drive.google.com/file/d/11wcT95cXSkFskkSJ4zmlJUymmEp_3gUk/view?usp=drive_link" },
    { description: "Assessment Guidelines", link: "https://drive.google.com/file/d/1f5goiw1ml4vh1zHeb34wkeHLQXgW8vTD/view?usp=drive_link" },
    { description: "List of Dangerous Buildings Notice - 27th October 2021", link: "https://drive.google.com/file/d/1jVcPAW3VKT523Mz5bnrDdbN7gJlCfADa/view?usp=drive_link" },
    { description: "Report - Illegal Banners, Hoardings, Notice Boards", link: "https://drive.google.com/file/d/1kBGXBm2efETEBsGLCogZWi7ZhIchOaYa/view?usp=drive_link" },
    { description: "Dangerous Building Notice", link: "https://drive.google.com/file/d/1XAffoqCHoAGdyk_lfPHYENQsvKeww9K4/view?usp=drive_link" },
    { description: "Dangerous Building Report", link: "https://drive.google.com/file/d/1R0wfxUWhd9SrU7_CZStuuYy0gGDlnwTt/view?usp=drive_link" },
    { description: "Action Against Illegal Construction (1st July to 31st December 2020)", link: "https://drive.google.com/file/d/1fGNHCg1NZUfM2sUGvKG8k786hMpME4Mw/view?usp=drive_link" },
    { description: "Action Against Illegal Banners and Posters", link: "https://drive.google.com/file/d/1j7mHse3Z6w4OACKmj7V5Ge40RzkQ4P0a/view?usp=drive_link" },
    { description: "Dangerous Building List - 2020", link: "https://drive.google.com/file/d/1YJMRioRzRUEokt4R96VaYUGAB-7EHfhW/view?usp=drive_link" },
    { description: "List of Illegal Constructions", link: "https://drive.google.com/file/d/18yXiPsFoDn28gksxE5QWrGEcBEPoofJ_/view?usp=drive_link" },
    { description: "UMC Disaster Management Plan - 2020", link: "https://drive.google.com/file/d/1OHrYPZ5mmc6SYpOSAowv_JZM14Z-9wL8/view?usp=drive_link" },
    { description: "Drainage Cleaning Report", link: "https://drive.google.com/file/d/1C2VlzaEDkf3wHy39Rcp24cur7Ge2v42t/view?usp=drive_link" },
    { description: "List of Modifications to Town Planning (TP/DP)", link: "https://drive.google.com/file/d/1V7ZswSp4VZjuDfpBiYeqjJ-Fi31RVfj2/view?usp=drive_link" },
    { description: "Public Notice Under Section 28(4) of Development Plan (DP)", link: "https://drive.google.com/file/d/1XIaZpCF-BqewxVbToKaShprMDafpSw1n/view?usp=drive_link" },
    { description: "Citizen Charter", link: "https://drive.google.com/file/d/1ggzzeGO1_p-Py_6vipha9izHYoP39p2X/view?usp=drive_link" },
    { description: "Property Tax Demand & Collection Book", link: "https://drive.google.com/file/d/1BHZK6UyeIZJ8YBSCXytCAci5PE8OAjOC/view?usp=drive_link" },
    // { description: "Action Report Against Unauthorized Posters, Banners, Hoardings, Flags, Arches, and Advertisement Boards in Ulhasnagar Municipal Corporation Area", link: "#" },
    // { description: "Budget Estimates for the Year 2022-2023", link: "#" },
    // { description: "Dismissal Order - 7th December 2021", link: "#" },
    // { description: "Pandal Permission", link: "#" },
    // { description: "List of Dangerous Buildings - 2019", link: "#" },
    // { description: "Click Here for Illegal Construction Complaint Status", link: "#" },
    // { description: "Revised Dismissal Order - 6th January 2022", link: "#" },
    // { description: "Demolition Action Report (1st January 2021 to 30th June 2021)", link: "#" },
    // { description: "Blood Donation", link: "#" },
    // { description: "Silence Zone List", link: "#" },
  ];

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.animation = "none";
      void scrollContainerRef.current.offsetHeight;
      scrollContainerRef.current.style.animation = "scroll-loop 25s linear infinite";
    }
  }, [information]);

  const handleMouseEnter = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.animationPlayState = "paused";
    }
  };

  const handleMouseLeave = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.animationPlayState = "running";
    }
  };

  const projectscrollContainerRef = useRef(null);

  useEffect(() => {
    if (projectscrollContainerRef.current) {
      projectscrollContainerRef.current.style.animation = "none";
      void projectscrollContainerRef.current.offsetHeight;
      projectscrollContainerRef.current.style.animation = "scroll-loop 15s linear infinite";
    }
  }, [projects]);
  const projectshandleMouseEnter = () => {
    if (projectscrollContainerRef.current) {
      projectscrollContainerRef.current.style.animationPlayState = "paused";
    }
  };

  const projectshandleMouseLeave = () => {
    if (projectscrollContainerRef.current) {
      projectscrollContainerRef.current.style.animationPlayState = "running";
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="container-fluid mb-4 mt-4">
      <div className="row">
        <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12">
          <div className="e-services-container p-2">
            <div className="tabs-container right-section-font mb-4">
              <ul className="nav nav-tabs gap-3 custom-nav-border">
                {tabData.map((tab) => (
                  <li className="nav-item" key={tab.id}>
                    <Link
                      className={`nav-link ${activeTab === tab.id ? "active" : ""
                        }`}
                      to={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                    >
                      {tab.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="news-list right-section-font">
              {tabData.find((tab) => tab.id === activeTab)?.layout ? (
                activeTab === "#e-services" ? (
                  <div className="e-services-layout mt-2 p-2">
                    <table className="table">
                      <tbody>
                        <tr>
                          <td>
                            <div className="service-item">
                              <img src={tick} alt="Tick" className="tick-icon me-2" />
                              <Link to='http://www.onlineumc.org.in:8080/umc/jsp/propertydues.jsp?id=4' className="text-decoration-none" style={{ color: "#000000" }} target="_blank">
                                <span className="service-text">Property Tax</span>
                              </Link>
                            </div>
                          </td>
                          <td>
                            <div className="service-item">
                              <img src={tick} alt="Tick" className="tick-icon me-2" />
                              <Link to='https://crsorgi.gov.in/web/index.php/auth/login' className="text-decoration-none" style={{ color: "#000000" }} target="_blank">
                                <span className="service-text">Birth Certificate</span>
                              </Link>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="service-item">
                              <img src={tick} alt="Tick" className="tick-icon me-2" />
                              <Link to='https://crsorgi.gov.in/web/index.php/auth/login' className="text-decoration-none" style={{ color: "#000000" }} target="_blank">
                                <span className="service-text">Death Certificate</span>
                              </Link>
                            </div>
                          </td>
                          <td>
                            <div className="service-item">
                              <img src={tick} alt="Tick" className="tick-icon me-2" />
                              <Link to='https://mahatenders.gov.in/nicgep/app' className="text-decoration-none" style={{ color: "#000000" }} target="_blank">
                                <span className="service-text">e-Tenders</span>
                              </Link>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="service-item">
                              <img src={tick} alt="Tick" className="tick-icon me-2" />
                              <Link to='https://aaplesarkar.mahaonline.gov.in/en' className="text-decoration-none" style={{ color: "#000000" }} target="_blank">
                                <span className="service-text">Aaple Sarkar</span>
                              </Link>
                            </div>
                          </td>
                          <td>
                            <div className="service-item">
                              <img src={tick} alt="Tick" className="tick-icon me-2" />
                              <Link to='https://grievances.maharashtra.gov.in/en' className="text-decoration-none" style={{ color: "#000000" }} target="_blank">
                                <span className="service-text">Aaple Sarkar Grievance Redressal Portal</span>
                              </Link>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="service-item">
                              <img src={tick} alt="Tick" className="tick-icon me-2" />
                              <Link to='http://water.umcgov.in/ViewConsumerDetails.aspx' className="text-decoration-none" style={{ color: "#000000" }} target="_blank">
                                <span className="service-text">Water Tax</span>
                              </Link>
                            </div>
                          </td>
                          <td>
                            <div className="service-item">
                              <img src={tick} alt="Tick" className="tick-icon me-2" />
                              <Link to='https://mahavastu.maharashtra.gov.in/' className="text-decoration-none" style={{ color: "#000000" }} target="_blank">
                                <span className="service-text">Building Plan Management System</span>
                              </Link>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="service-item">
                              <img src={tick} alt="Tick" className="tick-icon me-2" />
                              <Link to='http://smartumc.com/pandal_app/' className="text-decoration-none" style={{ color: "#000000" }} target="_blank">
                                <span className="service-text">Pandal Permission</span>
                              </Link>
                            </div>
                          </td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="initiatives-layout row mt-3">
                    <div className="col-md-6 mb-3">
                      <Link to='https://www.mpcb.gov.in/mr/waste-management/plastic-waste' className="text-decoration-none" style={{ color: "#000000" }} target="_blank">
                        <div className="initiative-item d-flex align-items-center border rounded">
                          <div className="img-container img-with-border">
                            <img
                              src={plasticWaste}
                              alt="Plastic Waste"
                              className="initiative-img"
                            />
                          </div>
                          <span className="initiative-text ms-3">
                            Plastic Waste Management
                          </span>
                        </div>
                      </Link>
                    </div>
                    <div className="col-md-6 mb-3">
                      <Link to='https://sbmurban.org/' className="text-decoration-none" style={{ color: "#000000" }} target="_blank">
                        <div className="initiative-item d-flex align-items-center border rounded">
                          <div className="img-container img-with-border">
                            <img
                              src={swachhBharat}
                              alt="Swachh Bharat Mission"
                              className="initiative-img"
                            />
                          </div>
                          <span className="initiative-text ms-3">Swachh Bharat Mission</span>
                        </div>
                      </Link>
                    </div>
                    <div className="col-md-6 mb-3">
                      <Link to='https://www.mpcb.gov.in/air-quality/Ulhasnagar/0000000128?fdate=15-11-2021&tdate=15-12-2021' className="text-decoration-none" style={{ color: "#000000" }} target="_blank">
                        <div className="initiative-item d-flex align-items-center border rounded">
                          <div className="img-container img-with-border">
                            <img
                              src={airQuality}
                              alt="Air Quality Data"
                              className="initiative-img"
                            />
                          </div>
                          <span className="initiative-text ms-3">Air Quality Data</span>
                        </div>
                      </Link>
                    </div>
                    <div className="col-md-6 mb-3">
                      <Link to='https://creatorkart.com/UMC_Frontend-New/rti' className="text-decoration-none" style={{ color: "#000000" }} target="_blank">
                        <div className="initiative-item d-flex align-items-center border rounded">
                          <div className="img-container img-with-border">
                            <img src={rti} alt="RTI UMC" className="initiative-img" />
                          </div>
                          <span className="initiative-text ms-3">RTI UMC</span>
                        </div>
                      </Link>
                    </div>
                    <div className="col-md-6 mb-3">
                      <Link to='https://creatorkart.com/UMC_Frontend-New/employee_information' className="text-decoration-none" style={{ color: "#000000" }} target="_blank">
                        <div className="initiative-item d-flex align-items-center border rounded">
                          <div className="img-container img-with-border">
                            <img
                              src={employeeInfo}
                              alt="Employee Information"
                              className="initiative-img"
                            />
                          </div>
                          <span className="initiative-text ms-3">Employee Information</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                )
              ) : activeTab === "#election" ? (
                <div className="no-data-message mt-3 text-center">
                  <span>No data available</span>
                </div>
              ) : (
                <ul className="list-unstyled">
                  {tabData
                    .find((tab) => tab.id === activeTab)
                    ?.items?.map((item, index) => (
                      <li key={index}>
                        <img src={tick} className="custom-icons" alt="" />
                        {typeof item === "object" ? (
                          <Link
                            to={item.link}
                            className={`text-decoration-none custom-list-effect ${activeIndex === index ? "active" : ""
                              }`}
                            target="_blank"
                            onClick={() => handleClick(index)}
                          >
                            {item.description}
                          </Link>
                        ) : (
                          item
                        )}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12 e-services-margin right-section-font">
          <div className="upcoming-projects bg-white p-2">
            <h5 className="p-2 h5-styling-div">Information</h5>
            <div className="scroll-wrapper">
              <div
                className="info-scroll-container"
                ref={scrollContainerRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <ul>
                  {information.map((info, index) => (
                    <li key={index} className="para-style1">
                      <Link
                        to={info.link}
                        className={`text-decoration-none custom-list-effect ${activeInfoIndex === index ? "active" : ""
                          }`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleInfoClick(index)}

                      >
                        {info.description}
                      </Link>
                    </li>
                  ))}
                </ul>
                <ul>
                  {information.map((info, index) => (
                    <li key={`duplicate-${index}`} className="para-style1">
                      <Link
                        to={info.link}
                        className={`text-decoration-none custom-list-effect ${activeInfoIndex === index ? "active" : ""
                          }`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleInfoClick(index)}

                      >
                        {info.description}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12 e-services-margin right-section-font">
          <div className="upcoming-projects bg-white p-2">
            <h5 className="p-2 h5-styling-5">Upcoming Projects</h5>
            <div className="scroll-wrapper">
              <div
                className="scroll-container"
                ref={projectscrollContainerRef}
                onMouseEnter={projectshandleMouseEnter}
                onMouseLeave={projectshandleMouseLeave}
              >
                {projects.map((project, index) => (
                  <div key={index}>
                    <div className="project-item">
                      <img
                        src={project.img}
                        alt="Project"
                        className="e-services-img me-3"
                      />
                      <div>
                        <p className="para-style">
                          <b>{project.heading} </b>
                          {project.description}
                        </p>
                      </div>
                    </div>
                    <hr className="mt-1" />
                  </div>
                ))}
                {projects.map((project, index) => (
                  <div key={`duplicate-${index}`}>
                    <div className="project-item">
                      <img
                        src={project.img}
                        alt="Project"
                        className="e-services-img me-3"
                      />
                      <div>
                        <p className="para-style">
                          <b>{project.heading} </b>
                          {project.description}
                        </p>
                      </div>
                    </div>
                    <hr className="mt-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EServices;

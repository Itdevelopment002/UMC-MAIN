import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./TendersQuotations.css";
import "../DepartmentCustomCss/DepartmentCustom.css";
import pdficon from '../../assets/images/Departments/document 1.png';
import Swal from 'sweetalert2';
import "../TableCss/TableCss.css"

const circularData = [
    {
        tender: "Objection- Tender No 2021_UMC_664594_1",
        department: "Public Work Department",
        link: "https://drive.google.com/file/d/1y_KEMFehoKtiuOm4o8tBegW_UF5tTyHs/view?usp=drive_link",
        posting: "View PDF",
    },
    {
        tender: "Quotation- Public Health",
        department: "Public Work Department",
        link: "#",
        posting: "View PDF",
    },
    {
        tender: "1st Extension Quotation- Public Health",
        department: "Public Work Department",
        link: "https://drive.google.com/file/d/137kGSXjgDC04hwqSzDt8QYUVWr23MkyA/view?usp=drive_link",
        posting: "View PDF",
    },
    {
        tender: "e-Tender No: 635509_1",
        department: "Public Work Department",
        link: "https://drive.google.com/file/d/1rnc7yCrAuWS2rprpFS8tsKF2lcy5Qqp7/view?usp=drive_link",
        posting: "View PDF",
    },
    {
        tender: "e-Tender No:635501_1",
        department: "Public Work Department",
        link: "https://drive.google.com/file/d/1_9Rl7t2U7msgpzOkHBInmL3dn8Fr45fn/view?usp=drive_link",
        posting: "View PDF",
    },
    {
        tender: "Quotation - Electric Department",
        department: "Electrical Engineer Department",
        link: "#",
        posting: "View PDF",
    },
    {
        tender: "Commercial Bid opening of Tender No : 2021_UMC_692187_1",
        department: "Public Health Department",
        link: "https://drive.google.com/file/d/1PCXwi2uf0QKZnJ0rlYayiDkkMZtseKgn/view?usp=drive_link",
        posting: "View PDF",
    },
    {
        tender: "Tender Notice for Oxygen Concentrator",
        department: "Medical Health Department",
        link: "https://drive.google.com/file/d/1R4oDVvRFusAsBJxm-NntHAW25AtwoMjp/view?usp=drive_link",
        posting: "View PDF",
    },
    {
        tender: "Tender Notice for Oxygen Concentrator",
        department: "Medical Health Department",
        link: "https://drive.google.com/file/d/1xhH5O-opKMLH8YJatglRhOimEkc3Z4fi/view?usp=drive_link",
        posting: "View PDF",
    },
    {
        tender: "Quotation - Electric Department Dated- 29 July 2021 no.66,67,69,70,71",
        department: "Electrical Engineer Department",
        link: "https://drive.google.com/file/d/14NZqVmN1RWqRRl627-fpVeznmOjjIUGq/view?usp=drive_link",
        posting: "View PDF",
    },
    {
        tender: "दिनांक 29/07/2021 रोजी दुपारी 12 वाजता निविदेतील अटी व शर्तीनुसार मूळ कागद पत्रासह हजर राहण्याबाबत",
        department: "Public Health Department",
        link: "https://drive.google.com/file/d/1vm3mdHX913DztzBnmUpZXdsC1OCOmNVf/view?usp=drive_link",
        posting: "View PDF",
    },
    {
        tender: "दिनांक ०२/०८/२०२१ रोजी दुपारी ०३:०० वाजता निविदेतील अटी व शर्तीनुसार मूळ कागद पत्रासह हजर राहणेबाबत",
        department: "Public Health Department",
        link: "https://drive.google.com/file/d/1s3JkTYODvFehbMVJApNz-YU7bSrRAUUG/view?usp=drive_link",
        posting: "View PDF",
    },
    {
        tender: "PWD Tender notice (2 August 2021 updated on 3rd August 2021)(UMC/PWD/Notice/2021-22/12/1 to /12/4 and UMC/PWD/Notice/2021-22/12/6 to /12/12)",
        department: "Public Health Department",
        link: "https://drive.google.com/file/d/1vbP-hlh77UP__seBZHkqPA4m5yrY3pXG/view?usp=drive_link",
        posting: "View PDF",
    },
    {
        tender: "PWD Tender notice dated 5th August 2021 UMC/PWD/Notice/2021-22/19/1 to UMC/PWD/Notice/2021-22/19/19)",
        department: "Public Health Department",
        link: "https://drive.google.com/file/d/1f69Vwu8hs6TzrtQScxEABLAeKFTfJWiz/view?usp=drive_link",
        posting: "View PDF",
    },
    {
        tender: "पात्र अपात्र निविदाकारांची माहिती(दिनांक - ५ ऑगस्ट २०२१) - ई निविदा क्र.2021_UMC_663594_1, ई निविदा क्र.2021_UMC_663562_1,ई निविदा क्र.2021_UMC_691951_1,ई निविदा क्र.2021_UMC_691983_1,ई निविदा क्र.2021_UMC_686722_1,ई निविदा क्र.2021_UMC_663604_1",
        department: "Public Health Department",
        link: "https://drive.google.com/file/d/1cuMF4V7jfFlCNrq5VFw3VAdKLukQwyIs/view?usp=drive_link",
        posting: "View PDF",
    },
    {
        tender: "दरपत्रक सूचना - सचिव कार्यालयात आयोजित करण्यात येणाऱ्या विविध मिटींगच्या कागदपत्रांची झेरॉक्स कॉपी उपलब्ध होणेबाबत (आवश्यकतेनुसार ). दिनांक - ५ ऑगस्ट २०२१",
        department: "Secretary Department",
        link: "https://drive.google.com/file/d/1_Re9b5kwiO1D9HduzDdJD-0gf2uflOE8/view?usp=drive_link",
        posting: "View PDF",
    },
    {
        tender: "पात्र अपात्र निविदाकारांची माहिती- ई निविदा क्र. ६३५४८१_१ . दिनांक - ९ ऑगस्ट २०२१",
        department: "Public Work Department",
        link: "https://drive.google.com/file/d/1EWkusFbA6YLI4ieH1qAtAyHcLSTA6xR3/view?usp=drive_link",
        posting: "View PDF",
    },
    {
        tender: "उल्हासनगर महानगरपालिका वाहन क्र. एम एच ०५ डी. एस २१४३ (स्वर्गरथ) या वाहनाकरिता नविन १२ व्होल्टेज M.H.D ८०० (EXIDE) कंपनीची बॅटरी मिळणेबाबत. Dated 12 August 2021",
        department: "Vehicle Department",
        link: "https://drive.google.com/file/d/1FzakX7OhSA_xEYITppoXVLAw8SSUepvx/view?usp=drive_link",
        posting: "View PDF",
    },
    {
        tender: "ब्लीचिंग पावडर , ३३% क्लोरीन आय एस आय प्रमाणित निर्जंतूकीकरणासाठी पुरवठा करुण देण्याबाबत . Dated 12 August 2021",
        department: "Public Health Department",
        link: "https://drive.google.com/file/d/1_0d56HqRV5RL-m0f5NWXCjIT76U02VCu/view?usp=drive_link",
        posting: "View PDF",
    },
    {
        tender: "ई-निविदा क्र 2021_UMC_704208_1 निविदेचा दुसरा लिफाफा(Commercial bid) उघडन्यापूर्वी हरकती सादर करण्याबाबत .Dated 12 August 2021",
        department: "Public Health Department",
        link: "#",
        posting: "View PDF",
    },
    {
        tender: "उल्हासनगर शहरातील नागरीकाकडून ओला कचरा वेगळा व सुका कचरा वेगळा करून घेणेबाबत. तसेच स्वच्छ महाराष्ट्र अभियान (नागरी) अंतर्गत घनकचरा व्यवस्थापन नियम २०१६ ची अंमलबजावणी प्रभावीपणे होणे करिता आवश्यक साहित्य/साधने पुरवठा करून देण्याबाबत. Dated 12 August 2021",
        department: "Public Health Department",
        link: "https://drive.google.com/file/d/1O39j0sUzbAyvLZHuAbrY6Jv9Kz-PcStn/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "विद्युत विभाग - दरपत्रक/ निविदा सुचना (उमपा/विद्युत/०२/७४,७५, ७८, ८०, ८१ दिनांक - १२ ऑगस्ट २०२१)",
        department: "Electrical Engineer Department",
        link: "https://drive.google.com/file/d/1wIgpwAIBidUIIWt0V3VSt4hLFFjpT0kY/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "पाणी पुरवठा विभाग सर्व साधारण निविदा सुचना क्र. २१, सन २०२१-२२ प्रसिद्ध करणेबाबत. दिनांक - १३ ऑगस्ट २०२१)",
        department: "Water Supply Department",
        link: "https://drive.google.com/file/d/1SQF-LR0zNdFMqzUh0p2kc_xE0A7_EWtj/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "PWD Tender notice dated 13 August 2021 UMC/PWD/Notice/2021-22/10/1 to UMC/PWD/Notice/2021-22/10/10)",
        department: "Public Work Department",
        link: "https://drive.google.com/file/d/1j3LjoDkFylB5TDOS36942T-yBSddjmyc/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "PWD Tender notice dated 17 August 2021 UMC/PWD/Notice/2021-22/15/1 to UMC/PWD/Notice/2021-22/15/15)",
        department: "Public Work Department",
        link: "#",
        posting: "View PDF"
    },
    {
        tender: "उल्हासनगर-४ प्रभाग क्र. १४ मधील आदर्शनगर येथे रेल्वे रुळाच्या बाजूला संरक्षण भिंत व नाला बनविणे या कामाच्या निविदा प्रक्रियेत पात्र /अपात्र निविदाकारांची माहिती- ई निविदा क्र. 2021_UMC_693849_1. दिनांक - २३ ऑगस्ट २०२१",
        department: "Public Work Department",
        link: "#",
        posting: "View PDF"
    },
    {
        tender: "विद्युत विभाग - दरपत्रक/ निविदा सुचना (उमपा/विद्युत/०२/८५ दिनांक - २३ ऑगस्ट २०२१)",
        department: "Electrical Engineer Department",
        link: "https://drive.google.com/file/d/12lpA3hJAulHhCVZ48pCCg8MICCsFThsh/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "IT Dept. - quotation for 'Portable Office Cabin Details with Accessories and Erection' Dated 24th Aug 2021)",
        department: "IT Department",
        link: "https://drive.google.com/file/d/1kYc61Kw0Pg9Dyn1MkKtUgkSEMs6fsYHt/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "विद्युत विभाग - दरपत्रक/ निविदा सुचना (उमपा/विद्युत/०२/९३ दिनांक - २७ ऑगस्ट २०२१)",
        department: "Electrical Engineer Department",
        link: "https://drive.google.com/file/d/1WL_WdTCvRMRNRGEZHTjrnnYRPj3iSIzE/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र.2021_UMC_697246-1 निविदेचा दुसरा लिफाफा (Commercial bid) उघडण्यापुर्वी हरकती सादर करण्याबाबत. दिनांक - ३० ऑगस्ट २०२१",
        department: "Health Department",
        link: "https://drive.google.com/file/d/1IpX6m2OPBmYyV5vLMSvEZdcwfs_n3k5v/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र.2021_UMC_६९६९२६_१ - उल्हासनगर 5 येथील बँक ऑफ इंडिया ते ब्यारेक नंबर 2046 पर्यंतच्या रस्त्याचे सिमेंट कॉक्रीटीकरण करणे या कामाच्या निविदा प्रक्रियेत पात्र/अपात्र निविदाकारांची माहिती.",
        department: "Public Work Department",
        link: "https://drive.google.com/file/d/1Si-EvblgHcG2pDvdnT14wR5yYJsGaGs3/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "Vehicle Department Quotation for 60 Meter 3/4 jetting hose pipe for MH 05 N.216(S.L.C.M)",
        department: "Vehicle Department",
        link: "https://drive.google.com/file/d/1AeT0II5kR6W2j3nPuBVYcga8MK50fYtX/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "विद्युत विभाग - दरपत्रक/ निविदा सुचना ( उमपा/विद्युत/०२/१०२ , उमपा/विद्युत/०२/१०३ , उमपा/विद्युत/०२/१०५ , उमपा/विद्युत/०२/१०७ दिनांक - ७ सप्टेंबर २०२१)",
        department: "Electrical Engineer Department",
        link: "https://drive.google.com/file/d/1P52j4rW3l-N6IU6Qi5YdssFQioI-gL1l/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "PWD Tender notice dated 7 September 2021 UMC/PWD/Notice/2021-22/9/1 to UMC/PWD/Notice/2021-22/9/9)",
        department: "Public Work Department",
        link: "https://drive.google.com/file/d/10keqIKZXjHsvWqLUc1W4NzeQHKwothPz/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र. 2021_UMC_697246_1, दि. १६/०९/२०२१ रोजी दुपारी १२:३० वाजता निविदेतील अटी व शर्तीनुसार मुळ कागदपत्रासह हजर राहण्याबाबत",
        department: "Public Health Department",
        link: "https://drive.google.com/file/d/1zgVhVo_xwvPusEiG9Q4mLbepDNmNho6T/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "शुध्दीपत्रक (ई-निविदा क्र. 2021_UMC_719019_1 पूर्व बैठक (Pre-Bid Meeting) बाबत )",
        department: "Public Health Department",
        link: "https://drive.google.com/file/d/19XXtoxWEQSZD0jC8bfi2y0uGDKwQhlCt/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "उल्हासनगर-४ मधील तक्षशिला जलकुंभाचे ठिकाणी बायपास व्यवस्था करणे व जुने नादुरुस्त व्हाल्व बदलणे . (निविदा सूचना क्रमांक २५ , सन २०२१-२२)",
        department: "Water Supply Department",
        link: "https://drive.google.com/file/d/1n5Rr6bbCHbDTSKWNCENoosdzzA-mJ5_L/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "विद्युत विभाग - दरपत्रक/ निविदा सुचना ( उमपा/विद्युत/०२/११२ , उमपा/विद्युत/०२/११६ , उमपा/विद्युत/०२/११७ , उमपा/विद्युत/०२/११८ दिनांक - १५ सप्टेंबर २०२१)",
        department: "Electrical Engineer Department",
        link: "https://drive.google.com/file/d/1fV8iVzQ_W2EpPrjZDGtUPmcXs2fTcXC7/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र.2021_UMC_719019_1, निविदा पुर्व बैठक बाबत (दिनांक १६/०९/२०२१ रोजीची प्री-बीड बैठक)",
        department: "Public Health Department",
        link: "#",
        posting: "View PDF"
    },
    {
        tender: "पाणी पुरवठा विभाग - सर्व साधारण निविदा सुचना क्र. २६ सन २०२१-२२ प्रसिद्ध करणेबाबत",
        department: "Water Supply Department",
        link: "https://drive.google.com/file/d/1Zu0OeZZ802NHZreFZfws_1RvB2IrM_ta/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "स्वच्छ भारत अभियान (नागरी) अंतर्गत स्वच्छ सर्वेक्षण अन्वये ओल्या कचऱ्यापासून खत निर्मितीसाठी प्रभाग समिती क्र. २ मध्ये कंपोस्ट पीट तयार करणेबाबत.",
        department: "Public Health Department",
        link: "https://drive.google.com/file/d/1lDgKmcqNjt1Fe9UocvfGp57VOcCgTRJE/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "झादी का अमृत महोत्सव ही मोहीम राबविणेकरिता साहित्य खरेदी करणेबाबत.",
        department: "Public Health Department",
        link: "#",
        posting: "View PDF"
    },
    {
        tender: "PWD Tender notice (22nd September 2021 updated on 22nd September 2021)(UMC/PWD/Notice/2021-22/09/1 to UMC/PWD/Notice/2021-22/09/09)",
        department: "Public Work Department",
        link: "https://drive.google.com/file/d/1Q3z2IdOAwUT2Hi-TFMg9bN1_9SmAiCbQ/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "स्वच्छ भारत अभियान (नागरी) अंतर्गत स्वच्छ सर्वेक्षण व कचरा मुक्त शहराच्या मानांकन प्राप्त करणेसाठी व ३-R Principle नुसार सुका कचरा प्लास्टिक प्लास्टीक व कांच इत्यादीवर प्रक्रिया करणेसाठी प्लास्टिक क्रशर/ग्राइंडर मशिन खरेदी करणेसाठी",
        department: "Public Health Department",
        link: "https://drive.google.com/file/d/1V9xJPQvc9xg2Uvt8nBJ31N7V4tCGuTaL/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "विद्युत विभाग - दरपत्रक/ निविदा सुचना ( उमपा/विद्युत/०२/१२३ , उमपा/विद्युत/०२/१२४ , उमपा/विद्युत/०२/१२५ , उमपा/विद्युत/०२/१२९, उमपा/विद्युत/०२/१३० दिनांक - २३ सप्टेंबर २०२१)",
        department: "Electrical Engineer Department",
        link: "https://drive.google.com/file/d/1hCXwuNxDdTxh-spZkmeIntRnwdTanYWk/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "पाणी पुरवठा विभाग - सर्व साधारण निविदा सुचना क्र. २९ सन २०२१-२२ प्रसिद्ध करणेबाबत",
        department: "Water Supply Department",
        link: "https://drive.google.com/file/d/1DnGBk_zeB82S2LmBpFzaNG6PYokZGTNO/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "उल्हासनगर महानगरपालिकेचे वाहन क्र. एम एच ०५ आर. ८८७ (रुग्णवाहिका ) या वाहनाचे दुरुस्ती करणेबाबत. Dated ८ October २०२१",
        department: "Vehicle Department",
        link: "https://drive.google.com/file/d/1VtQw98LyTCLhuxPi6Qo6L0aB5DsXhTL4/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "उल्हासनगर महानगरपालिका कार्यक्षेत्रात सुरु करण्यात आलेल्या RTPCR प्रयोगशाळेकरिता आवश्यक असलेले मागणीनुसार प्रयोगशाळा साहित्य खरेदी करणेबाबत.",
        department: "Health Department",
        link: "https://drive.google.com/file/d/1yKzElXT3EIM7NMX6LeN_H8Neb6ElZRjH/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "PWD Tender notice dated 12 October 2021 UMC/PWD/Notice/2021-22/2/1 to UMC/PWD/Notice/2021-22/2/2)",
        department: "Public Work Department",
        link: "https://drive.google.com/file/d/1B4U0AuXrULTp_rH-vtO8VRDOp_8jpgcy/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "विद्युत विभाग - दरपत्रक/ निविदा सुचना (उमपा/विद्युत/०२/१४० दिनांक - १३/१०/२०२१, उमपा/विद्युत/०२/१४३ दिनांक - १३/१०/२०२१, उमपा/विद्युत/०२/१४४ दिनांक - १३/१०/२०२१, उमपा/विद्युत/०२/१४६ दिनांक - १३/१०/२०२१, उमपा/विद्युत/०२/१४७ दिनांक - १३/१०/२०२१ )",
        department: "Electrical Engineer Department",
        link: "https://drive.google.com/file/d/10JpT9QBn5STfttJ_ue3UiWTR72e1Z0zj/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "उल्हासनगर मधील फ्रेंड्स मेडिकल ते अमर जवान चौक या रस्त्याचा विकास करणे. ई निविदा क्र. २०२१_UMC_७१८०२३_१",
        department: "Public Work Department",
        link: "https://drive.google.com/file/d/18AmhkhK4myxeRV4e1q0jzsHSM5DgBXa5/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "सर्वसाधारण निविदा सुचना क्र. ३२, सन २०२१-२२",
        department: "Water Supply Department",
        link: "https://drive.google.com/file/d/1p94tK_8p4X4wKRU8-Ak6phUZqwqbbzk6/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "तांत्रिक बाब (Technical) निविदा उघडणेस उपस्तिथ राहणेबाबत. अळीनाशक/डासनाशक औषधाचा पुरवठा होणेबाबत. ई-निविदा क्र. २०२१_UMC_७२४५५८_१",
        department: "Public Health Department",
        link: "https://drive.google.com/file/d/1JVjiRZQWb2hoAkt3rXWCtwtyfPj5HHQi/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "विद्युत विभाग - दरपत्रक/ निविदा सुचना (उमपा/विद्युत/०२/१४८ , उमपा/विद्युत/०२/१४९ , उमपा/विद्युत/०२/१५, उमपा/विद्युत/०२/१५१ , उमपा/विद्युत/०२/१५२, उमपा/विद्युत/०२/१५३ द, उमपा/विद्युत/०२/१५४ , उमपा/विद्युत/०२/१५५ दिनांक - २०/१०/२०२१ )",
        department: "Electrical Engineer Department",
        link: "https://drive.google.com/file/d/1OATONlQJSgXqg_dA7Ak7aZR0ZbgBuvtT/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "E-Tender NO - 2021_UMC_696912_1 - उल्हासनगर-२ प्रभाग क्र. ७ मधील संत ज्ञानेश्वर नगर गेट ते जगु चहावाला पर्यंत पेव्हमेंट रोड व नाली बनविणे, या कामाच्या निविदा प्रक्रियेत पात्र/अपात्र निविदाकारांची माहिती संकेतस्थळावर प्रसिद्ध करणेबाबत. दि, २८ ऑक्टोबर २०२१.",
        department: "Public Work Department",
        link: "https://drive.google.com/file/d/1wXn7zBscGPX3-ZbGmsLlVnbiEDRrQfPO/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "E-Tender NO - 2021_UMC_719019_1 - तांत्रिक बाब (Technical) निविदा उघडणेस उपस्थित राहणेबाबत.",
        department: "Public Health Department",
        link: "https://drive.google.com/file/d/1H5xKEQBQOiuI0CPI5VLocuswXiAo13y9/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "दरपत्रक नोटीस - स्वच्छ भारत अभियान (नागरी) अंतर्गत स्वच्छ सर्वेक्षण अन्वये ओल्या कचऱ्यापासून खत निर्मितीसाठी प्रभाग समिती क्र. ३ मध्ये कंपोस्ट पीट तयार करण्याबाबत.",
        department: "Public Health Department",
        link: "https://drive.google.com/file/d/1c092GmQzVEOF_O7CJqdBZLDdiEp6h1cA/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "दरपत्रक नोटीस - स्वच्छ भारत अभियान (नागरी) अंतर्गत स्वच्छ सर्वेक्षण अन्वये ओल्या कचऱ्यापासून खत निर्मितीसाठी प्रभाग समिती क्र. ४ मध्ये कंपोस्ट पीट तयार करण्याबाबत.",
        department: "Public Health Department",
        link: "https://drive.google.com/file/d/1oW0pAkdYSyDIJoN8s5GZgZLMnqiDpepm/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "उल्हासनगर महानगरपालिकेचे वाहन क्र. एम एच ०५. एन . ७४ या वाहनाचे दुरुस्ती करणेबाबत. Dated २९ ऑक्टोबर २०२१",
        department: "Vehicle Department",
        link: "https://drive.google.com/file/d/1AyIZxkUrHwz1b9W74juTJp0TzGSBo9yx/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "उल्हासनगर महानगरपालिकेचे वाहन क्र. एम एच ०५. आर. ८८९ (रुग्णवाहिका) या वाहनाचे बॅटरी खरेदीकरणे बाबत. Dated २९ ऑक्टोबर २०२१",
        department: "Vehicle Department",
        link: "https://drive.google.com/file/d/11E6adSwXCFinVV3aAZ4ilJ1CK3DWiIB6/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "विद्युत विभाग - दरपत्रक/ निविदा सुचना (उमपा/विद्युत/०२/१६८ , उमपा/विद्युत/०२/१६७ , उमपा/विद्युत/०२/१७१, उमपा/विद्युत/०२/१७२ , उमपा/विद्युत/०२/१७७, उमपा/विद्युत/०२/१७८ द, उमपा/विद्युत/०२/१७९ , उमपा/विद्युत/०२/१५५ दिनांक - ०१/११/२०२१ )",
        department: "Electrical Engineer Department",
        link: "https://drive.google.com/file/d/1YJisBjdXVm3X545FUXkbrT9fNU9U0qmN/view?usp=drive_link",
        posting: "View PDF",
    },
    {
        tender: "PWD Tender Notice for tender no. UMC/PWD/Notice/2021-22/4/1, UMC/PWD/Notice/2021-22/4/2, UMC/PWD/Notice/2021-22/4/3, UMC/PWD/Notice/2021-22/4/4, Date- 1 Nov 2021",
        department: "Public Work Department",
        link: "https://drive.google.com/file/d/1yDwfuQL1G2QFFVou6Mbp9_3DHv7y_Fkt/view?usp=drive_link",
        posting: "View PDF",
    },
    {
        tender: "पाणी पुरवठा विभाग ,फेरनिविदा - सर्व साधारण निविदा सुचना क्र. ३३, सन २०२१-२२, दिनांक - १ नोव्हेंबर २०२१",
        department: "Water Supply Department",
        link: "https://drive.google.com/file/d/1YokLx18nv5kL2XqAXjv8HbtywA4TlbsL/view?usp=drive_link",
        posting: "View PDF",
    },
    {
        tender: "ई- निविदा क्र- 2020_UMC_697246_1, उल्हासनगर महानगरपालिका क्षेत्रामध्ये घनकचरा व्यवस्थापन नियम २०१६ व स्वच्छ भारत अभियान मोहिम प्रभाविपणे राबविणेकामी व नागरीकांना शिस्त लावणेसाठी अभिकर्त्यामार्फत 'स्वच्छता मार्शल' ची नियुक्ती करणेबाबतच्या निविदेची दि-१६/०९/२०२१ रोजी च्या बैठकीबाबत व आर्थिक (Commercial) बाब निविदा उघडणेस उपस्थित राहाणेबाबत.",
        department: "Public Health Department",
        link: "https://drive.google.com/file/d/1uhAr-6t4FhR86WKLF4uGq8WMBadFdJ5-/view?usp=drive_link",
        posting: "View PDF",
    },
    {
        tender: "ई- निविदा क्र- २०२१_UMC_७२४५५८_१, निविदेचा दुसरा लिफाफा उघडण्यापूर्वी हरकती सादर करण्याबाबत.",
        department: "Public Health Department",
        link: "https://drive.google.com/file/d/14E8h4RAKUh6tSBnsl6NNaiSmjd2gvFff/view?usp=drive_link",
        posting: "View PDF",
    },
    {
        tender: "शुध्दीपत्रक - १६ नोव्हेंबर २०२१",
        department: "Public Health Department",
        link: "https://drive.google.com/file/d/1MtRZ2VUkF55M6Vhd--wCL6_JbWKt6cFj/view?usp=drive_link",
        posting: "View PDF",
    },
    {
        tender: "उल्हासनगर महानगरपालिकेच्या (चार एस. एल. सी. एम.) वाहनासाठी प्रत्येकी ६० मीटर नवीन जेटींग पाईप खरेदी करणेसाठी मंजुरी मिळणेबाबत - १८ नोव्हेंबर २०२१",
        department: "Vehicle Department",
        link: "https://drive.google.com/file/d/1WsSVCjphlXbY17uu1kgQn72mMlSY8HLk/view?usp=drive_link",
        posting: "View PDF",
    },
    {
        tender: "उल्हासनगर महानगरपालिका कार्यक्षेत्रात सुरु करण्यात आलेल्या RTPCR प्रयोगशाळेकरीता आवश्यक असलेले मागणीनुसार प्रयोगशाळा साहित्य (Consumable Item ) खरेदी करणेबाबत. - २२ नोव्हेंबर २०२१",
        department: "Medical Officer Health Department",
        link: "https://drive.google.com/file/d/1Y6k34j6Bj20fpBp7tkusm3jO4-EwZVCC/view?usp=drive_link",
        posting: "View PDF",
    },
    {
        tender: "सर्व साधारण निविदा सूचना क्रमांक ३६, २४ नोव्हेंबर २०२१",
        department: "Water Supply Department",
        link: "https://drive.google.com/file/d/1F813-VxBC_lHa8V5sbulcu6OwSnmr3tu/view?usp=drive_link",
        posting: "View PDF",
    },
    {
        tender: "Tender Notice- (UMC/PWD/Notice/2021-22/5/1, UMC/PWD/Notice/2021-22/5/2, UMC/PWD/Notice/2021-22/5/3, UMC/PWD/Notice/2021-22/5/4, UMC/PWD/Notice/2021-22/5/5 ) Date- 6th Dec 2021",
        department: "Public Work Department",
        link: "https://drive.google.com/file/d/1561cHUUpHZBV_l7B_AP33mPRzaz94psc/view?usp=drive_link",
        posting: "View PDF",
    },
    {
        tender: "Tender Notice- (UMC/PWD/Notice/2021-22/1/1 )from Date- 9th Dec 2021",
        department: "Public Work Department",
        link: "#",
        posting: "View PDF",
    },
    {
        tender: "विद्युत अभियांत्रिकी विभाग - निविदा सुचना - ( उमपा/विद्युत/०२/१९३, उमपा/विद्युत/०२/१९६ , उमपा/विद्युत/०२/१९७ , उमपा/विद्युत/०२/१९९, उमपा/विद्युत/०२/२०१) दिनांक - ०६/१२/२०२१",
        department: "Electrical Engineer Department",
        link: "#",
        posting: "View PDF",
    },
    {
        tender: "ई-निविदा क्र. 2021_UMC_719019_1 निविदेचा दुसरा लिफाफा (Commercial bid)उघडण्यापुर्वी हरकती सादर करण्याबाबत.(दि. ०८/१२/२०१ रोजी सायंकाळी ०५:०० वाजेपर्यंत ) दिनांक - ०६/१२/२०२१",
        department: "Public Health Department",
        link: "https://drive.google.com/file/d/1Wa862sNmo2CdUBMNcTUFPsF_3CmmmLo4/view?usp=drive_link",
        posting: "View PDF",
    },
    {
        tender: "संभाव्य कोवीड-१९ तिसऱ्या लाटेचा धोका लक्षात घेता प्रतिबंधात्मक उपाययोजना व पुर्व तयारीच्या अनुषंगाने उमपा मार्फत सुरु करण्यात आलेले व नव्याने सुरु करण्यात येणाऱ्या DCHC/DCH ऑक्सिजन साठा करणेकरीता भाडे तत्त्वावर ड्युरा सिलेंडर घेणेबाबत. दिनांक - ०६/१२/२०२१",
        department: "Medical Health Department",
        link: "https://drive.google.com/file/d/135OQLvMUb89LgxxponEv_a_aoa-Otu92/view?usp=drive_link",
        posting: "View PDF",
    },
    {
        tender: "सर्व साधारण निविदा क्र. ३७ सन २०२१-२२ दिनांक - ०७/१२/२०२१",
        department: "Water Supply Department",
        link: "https://drive.google.com/file/d/1Vby4XlsYc8GlwoICme8-LPwhdmvuK65d/view?usp=drive_link",
        posting: "View PDF",
    },
    {
        tender: "जाहीर सूचना - मालमत्ता कर विभाग दिनांक - ०७/१२/२०२१",
        department: "Tax Department",
        link: "https://drive.google.com/file/d/1hHMK0cH6wL41rTKsBp4FNjJ2ncDpKxiG/view?usp=drive_link",
        posting: "View PDF",
    },
    {
        tender: "दर पत्रके देणेबाबत - ०९ डिसेंबर २०२१",
        department: "Health Department",
        link: "https://drive.google.com/file/d/1hWq628C4muqLmCxOzAOstFR_C5LSykkc/view?usp=drive_link",
        posting: "View PDF",
    },
    {
        tender: "ई-निविदा क्र. २०२१_UMC_७३५८६७_१ - ( दिनांक १३/१२/२०२१ रोजी सायंकाळी ०५:०० वाजेपर्यंत हरकत प्राप्त न झाल्यास निविदेचा दुसरा लिफाफा उघडण्यात येईल )",
        department: "Public Health Department",
        link: "https://drive.google.com/file/d/16ThG44e5MQORIZyQD83PG544E6F-9Lbn/view?usp=drive_link",
        posting: "View PDF",
    },
    {
        tender: "सर्व साधारण निविदा सूचना क्र. ३९ सन २०२१-२२",
        department: "Water Supply Department",
        link: "https://drive.google.com/file/d/1XSwRhzUKd5d9xnsrtiMHXKdS7dsj4n4P/view?usp=drive_link",
        posting: "View PDF",
    },
    {
        tender: "जाहीर सूचना - २१ डिसेंबर २०२१",
        department: "Property Tax Department",
        link: "https://drive.google.com/file/d/1kV1YTWKk5Sbd3wMuqLRaLPdTpD4g6eyN/view?usp=drive_link",
        posting: "View PDF",
    },
    {
        tender: "सर्व साधारण निविदा सूचना क्र. 40 सन २०२१-२२",
        department: "Water Supply Department",
        link: "https://drive.google.com/file/d/152wvO-Khd41989l1MK2AbMkRep142D7B/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "विद्युत विभाग - निविदा सुचना (उमपा/विद्युत/०२/२१५ , उमपा/विद्युत/०२/२१६ , उमपा/विद्युत/०२/२१७, उमपा/विद्युत/०२/२१९ दिनांक - २७/१२/२०२१ )",
        department: "Electrical Engineer Department",
        link: "https://drive.google.com/file/d/1pmfBQYJ8jI0-SFnfJ7-WfbyTtvSyCWkg/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "Tender Notice - 29 Dec 2021",
        department: "PWD Department",
        link: "https://drive.google.com/file/d/1KUtTbxwV3P7FrdXRSkgN78DseVCGE4Q-/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "Tender Notice- (UMC/PWD/Notice/2021-22/12/1, UMC/PWD/Notice/2021-22/12/2, UMC/PWD/Notice/2021-22/12/3, UMC/PWD/Notice/2021-22/12/4, UMC/PWD/Notice/2021-22/12/5, UMC/PWD/Notice/2021-22/12/6, UMC/PWD/Notice/2021-22/12/7, UMC/PWD/Notice/2021-22/12/8, UMC/PWD/Notice/2021-22/12/9, UMC/PWD/Notice/2021-22/12/10, UMC/PWD/Notice/2021-22/12/11, UMC/PWD/Notice/2021-22/12/12 ) Date- 5th JAN 2022",
        department: "Public Work Department",
        link: "https://drive.google.com/file/d/1cbJt23Il8V1YVHtCvrgmULGx-UsWNVfF/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "जनहित याचिका क्र. १५५/२०११",
        department: "Unauthorized Construction Removal Department",
        link: "https://drive.google.com/file/d/1JvqpYK1N8yT8nwL3kDCR2FtUrdpLpnCZ/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "दरपत्रक सूचना - शुद्ध हवा कार्यक्रम अंतर्गत सल्लागार नियुक्ती करणेबाबत - ०६ जानेवारी २०२२",
        department: "Environment Department",
        link: "https://drive.google.com/file/d/1_jNgVEK3qTptB_r3E58-ok5hX65nSRK-/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "दिनांक ०१ जुलै, २०२१ ते दिनांक ३१ डिसेंबर, २०२१ पर्यंतचा बांधकाम निष्कासन कारवाईबाबतचा अहवाल.",
        department: "Unauthorized Construction Removal Department",
        link: "https://drive.google.com/file/d/1HeqEG_GUdVwgsY58R4z5ZsryvWhphjTj/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र. ७१३७१३_१, ७१३७२९_१, ७४३६३३_१ पात्र/अपात्र निविदाकारांची माहिती.",
        department: "Construction Department",
        link: "https://drive.google.com/file/d/1dE2na3uZi0p5rov5BeFgQl8BwYIBoKD7/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "सर्व साधारण निविदा सुचना क्र. ४५, सन २०२१-२२, दिनांक-२० जानेवारी २०२२",
        department: "Water Supply Department",
        link: "https://drive.google.com/file/d/1EURNT8Q0ZLMVF5IjKkPIMshWJiicFg9B/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र. ७४२४९१, ७४२५०६_१ पात्र/अपात्र निविदाकारांची माहिती.",
        department: "Construction Department",
        link: "https://drive.google.com/file/d/1uMAkRwqqqLw0kI6rq74z1Y-8ZDjbr67V/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "उल्हासनगर-३ येथील पॅनल क्र. १२ मधील संजय गांधी नगर, उल्हास स्टेशन ते स्वामी धरमदास गौशाला पर्यंतचा पुल बांधणे रुपये ४,००,००,०००/- एवढ्या खर्चाच्या कामाच्या निविदा प्रक्रियेत प्राप्त /अप्राप्त निविदाकारांची माहिती संकेतस्थळावर प्रसिद्ध करणेबाबत.",
        department: "Public Work Department",
        link: "https://drive.google.com/file/d/1oX2Ofa_b1RpRLN5ASKT8sxE1y018fumi/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "उल्हासनगर-३ येथील पॅनल क्र. १२ मधील संजय गांधी नगर, उल्हास स्टेशन ते स्वामी धरमदास गौशाला पर्यंतचा पुल बांधणे रुपये ४,००,००,०००/- एवढ्या खर्चाच्या कामाच्या निविदा प्रक्रियेत प्राप्त /अप्राप्त निविदाकारांची माहिती संकेतस्थळावर प्रसिद्ध करणेबाबत.",
        department: "Property Tax Department",
        link: "#",
        posting: "View PDF"
    },
    {
        tender: "मालमत्ता कर बिलाचा भरणा न केलेल्या कसूरदारांविरुद्ध सक्तची कारवाई करणेसाठी अधिपत्राच्या प्रति (वारंट)(दोन प्रतित ) छपाई करणे तसेच रबरी शिक्के बनवणेबाबत.",
        department: "Property Tax Department",
        link: "https://drive.google.com/file/d/1KWNexVTaQ7G6EfnCjUda-B3OVITZGVf0/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "मालमत्ता कर बिलाचा भरणा न केलेल्या कसूरदारांविरुद्ध सक्तची कारवाई करणेसाठी अधिपत्राच्या प्रति (वारंट)(दोन प्रतित ) छपाई करणे तसेच रबरी शिक्के बनवणेबाबत.",
        department: "Property Tax Department",
        link: "https://drive.google.com/file/d/1LPXDiiXtGL2tQaBZEQlSqpMki65FUJJW/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "पर्यावरण सद्यस्थिती अहवाल तयार करून मिळणेबाबत.",
        department: "Environment Department",
        link: "#",
        posting: "View PDF"
    },
    {
        tender: "PWD Tender notice (14 Feb 2022 to 28 Feb 2022)(UMC/PWD/Notice/2021-22/09/1 to UMC/PWD/Notice/2021-22/09/09)",
        department: "Public Work Department",
        link: "https://drive.google.com/file/d/1sP6hh39CJFvK7RaG14Y8IVL381IpiJ5m/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "उल्हासनगर महानगरपालिका क्षेत्रात माझी वसुंधरा अभियान २.० अंतर्गत सायकल मॅरेथॉन (Cycle Marathon)आयोजीत करणे.",
        department: "Environment Department",
        link: "#",
        posting: "View PDF"
    },
    {
        tender: "E_tender_2022_UMC_758824_1 (मे. बी व्ही जी इंडीया लि ,पुणे व मे. ए जी इन्व्हायरो इन्फ्रा प्रो.प्रा.लि या कंपन्यांनी २४ फेब २०२२ पर्यंत नमूद कागदपत्रे सादर करण्याबाबत.)",
        department: "Public Health Department",
        link: "https://drive.google.com/file/d/1UFksADdskJEb1PSaf422Uvie5EGwQsDY/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "Quotation vehicle department dated - 24.2.22",
        department: "Vehicle Department",
        link: "https://drive.google.com/file/d/1N7lVYFlT12TEaipW18PuKx3Z-ngRp4zL/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र. २०२२_UMC_७५८८२४_१ निविदेचा दुसरा लिफाफा (Commercial bid) उघडण्यापूर्वी हरकती सादर करणेबाबत.",
        department: "Public Health Department",
        link: "https://drive.google.com/file/d/1JxvEFPdaZ6ZS7i2h6EtELNhK3gFHiWcF/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई निविदा क्र. ७४२३६६_१ प्रक्रियेत पात्र/अपात्र निविदाकारांची माहिती",
        department: "Public Work Department",
        link: "https://drive.google.com/file/d/16d1eR3-YnfHzOEGgqdUsV15k0qp5v3J6/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "स्वच्छ भारत अभियान अंतर्गत शहरात मुख्य भिंतींवर जनजागृती संदेश पेन्ट करून घेणेबाबत दरपत्रक नोटीस",
        department: "Public Health Department",
        link: "https://drive.google.com/file/d/1jLQSgc-WcJRTroX2JuZ7Js9zmsQV2A6W/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "बायोमेडिकल वेस्ट बॅगचे खरेदिकरणेबाबत दरपत्रक नोटीस",
        department: "Public Work Department",
        link: "https://drive.google.com/file/d/1Q8VRl9MVex4kJB18HO0j5C4zkxH5WI5G/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "बायोमेडिकल वेस्ट (पिवळा रंग) बॅगचे खरेदि करणेबाबत दरपत्रक नोटीस",
        department: "Public Work Department",
        link: "https://drive.google.com/file/d/1iyBDFqWeD89HW7kT86dXbMt20DK5heGA/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई - निविदा क्र. ७४२३३१_१ प्रक्रियेत पात्र अपात्र निविदाकारांची माहिती",
        department: "Public Work Department",
        link: "https://drive.google.com/file/d/1rctWIVCoWfZkgWVEIfogNFxGF9io2WiS/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई - निविदा क्र. ७४२३४७_१ प्रक्रियेत पात्र अपात्र निविदाकारांची माहिती",
        department: "Public Work Department",
        link: "https://drive.google.com/file/d/1pwN9WgPIEqhFP87jFpHUJgrcPt9uNrIi/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई - निविदा क्र. २०२२_UMC _७६६९४३_१ निविदेचा दुसरा लिफाफ...COMMERCIAL BID) उघडण्यापूर्वी हरकती सादर करण्याबाबत",
        department: "Public Health Department",
        link: "https://drive.google.com/file/d/1smXlUAQ-CJ_frKPkr4i2zCUeL5xOjU18/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई निविदा क्र. 2022_UMC_766943_1 आर्थिक बाब (Commercial) निविदा उघडणेस उपस्थित राहणेबाबत",
        department: "Public Health Department",
        link: "https://drive.google.com/file/d/1fc417nWWKPgZ52Yc1_5bjWfMLMoJV2Z4/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "(ई-निविदा क्र.2022_UMC_758264_1) बाबत अटी व शर्तीनुसार सदर कागदपत्रांची पुर्तता करण्याकरिता मे. अभिषेक कंन्स्ट्रक्शन, मे. झा पी ॲण्ड कंपनी, मे. संत गाडगेबाब महाराज बेरोजगार संस्था, मे. शार्प सर्विसेस यांना पत्र.",
        department: "Public Health Department",
        link: "https://drive.google.com/file/d/1MOotc0rMFMOdE8a9lhsh6aAEeeL33InK/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र :- ७२६१८०_१, पात्र/अपात्र निविदाकारांची माहिती",
        department: "Construction Department",
        link: "#",
        posting: "View PDF"
    },
    {
        tender: "उल्हासनगर महानगरपालिकेच्या आरक्षित जागांची / प्लॉटची मशीनद्वारे मोजणी करणे व मोजणी नकाशा ०५ प्रतीत सादर करणे बाबत दरपत्रक सूचना",
        department: "Property Department",
        link: "https://drive.google.com/file/d/1s5RB3vbwYhRUkara_CSK0Gpx6gryngu8/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र :- ७६१५६५_१,७६१५५३_१ पात्र/अपात्र निविदाकारांची माहिती",
        department: "Construction Department",
        link: "https://drive.google.com/file/d/1wuw_wpIABm6nq61Z8yWCmIqyaUbjvsZD/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र :- ७६६६४४_१,७६६६४५_१ पात्र/अपात्र निविदाकारांची माहिती",
        department: "Construction Department",
        link: "https://drive.google.com/file/d/1XE_BTjugIz47k5KKN3YhEAK3LRxkumSp/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र :- ६६३५५४_१ पात्र/अपात्र निविदाकारांची माहिती",
        department: "Construction Department",
        link: "https://drive.google.com/file/d/1wUNLjiSCNMuaSGiYsUn1heTBLYD0z7DZ/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र. 2022_UMC_758264_1 निविदेचा दुसरा लिफाफा (Commercial bid) उघडण्यापुर्वी हरकती सादर करण्याबाबत.",
        department: "Health Department",
        link: "https://drive.google.com/file/d/1__cLZJn3DRlDqiMJ7ktH4XycRf3vimLZ/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र :- 768465_1 पात्र/अपात्र निविदाकारांची माहिती",
        department: "Construction Department",
        link: "https://drive.google.com/file/d/1rUZnWVRdES34I2lm0GtYEI-5yXFQZyjo/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र :- 768467_1 पात्र/अपात्र निविदाकारांची माहिती",
        department: "Construction Department",
        link: "https://drive.google.com/file/d/1p4sabHAG4_bSXylNQL04wX9UiyZPChaG/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र :- 768468_1 पात्र/अपात्र निविदाकारांची माहिती",
        department: "Construction Department",
        link: "https://drive.google.com/file/d/1EagR5CKbbdaQ5k2khb8K8IR4lW1nILPu/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र. २०२२UMC७५७२१५_१ बाबत बैठकीचे इतिवृत्त",
        department: "General Administration Department",
        link: "https://drive.google.com/file/d/1Vs2fl7YmC4HTXJKquz7lhWR6bjngoAFO/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र:- ७६६६४८१ पात्र/अपात्र निविदाकारांची माहिती",
        department: "Construction Department",
        link: "https://drive.google.com/file/d/1Xi7P8YrOblfZKPTrRe8pNsGDmSUFhyX6/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र:-७६८४६५_१ पात्र/अपात्र निविदाकारांची माहिती",
        department: "Construction Department",
        link: "https://drive.google.com/file/d/1pd0j0D1c9ImefRpKLObj1ZLIfYvMfz8E/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र :- 766646_1 पात्र/अपात्र निविदाकारांची माहिती",
        department: "Construction Department",
        link: "https://drive.google.com/file/d/1dNoINj5evgPFUhdVFG8Px65xL7JguJ4O/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र. 2022_UMC_778252_1 निविदेचा दुसरा लिफाफा (Commercial bid) उघडण्यापुर्वी हरकती सादर करण्याबाबत.",
        department: "Public Health Department",
        link: "https://drive.google.com/file/d/18t0oLPrXDv9GsiE58GxK5vgiLdJ6true/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र:-७८३८८१_१ पात्र/अपात्र निविदाकारांची माहिती",
        department: "Construction Department",
        link: "https://drive.google.com/file/d/1ZL-DIOlOlpfmWmQPEJPwmp4qjb3uLior/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र. २०२२UMC७६९३१३_१. या ई-निविदेची पात्र/अपात्र निविदाकारांची माहिती",
        department: "General Administration Department",
        link: "https://drive.google.com/file/d/16PlwvhrKm1xlfMcSHlsineTF4Ll55G4a/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र: - ७८६१२४_१ पात्र/अपात्र निविदाकारांची माहिती",
        department: "Construction Department",
        link: "https://drive.google.com/file/d/1wZN_58giRIh4MRrzq-htuYpcQ25mjt1v/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र: - ७७९१५३_१ पात्र/अपात्र निविदाकारांची माहिती",
        department: "Construction Department",
        link: "https://drive.google.com/file/d/1iUhXbtvHU2QIogeHxQOQMXw03ALtTWNU/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र: - ७८७९३२_१ पात्र/अपात्र निविदाकारांची माहिती",
        department: "Construction Department",
        link: "#",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र:- ७८३९७०_१ पात्र/अपात्र निविदाकारांची माहिती",
        department: "Construction Department",
        link: "https://drive.google.com/file/d/1suxGLWvXyaPw0yF74UWM_WAKJZ-vw0PQ/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "निरुपयोगी विद्युत साहित्याची विल्हेवाट/विक्री करिता निविदा सुचना",
        department: "Electrical Engineer Department",
        link: "https://drive.google.com/file/d/1c54V9C20V6bCOV2UcVijZpCempOdSQJL/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "निविदा सुचना जा. क्र.उपमा/विद्युत/02/06, 07, 08 ,09, 10 दिनांक 03.06.2022",
        department: "Electrical Engineer Department",
        link: "https://drive.google.com/file/d/1BA0e75RHSDfV-JFlK0j1AgOcU6Axwn8v/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई निविदा क्र. ७९६४७४_१ पात्र/अपात्र निविदाकारांची माहिती",
        department: "PWD Department",
        link: "https://drive.google.com/file/d/1GPXonM-yH83WQB1xDBBZwgrmHIF1B8Ra/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र:- ७९०८८३_१ पात्र/अपात्र निविदाकारांची माहिती",
        department: "Construction Department",
        link: "https://drive.google.com/file/d/1FxgCAVpPrDOfXRZnm7NubYxrxWuuy8GL/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र:- 200_UMC_803583_1 पात्र/अपात्र निविदाकारांची माहिती",
        department: "NULM Department",
        link: "https://drive.google.com/file/d/142dPYJEUDcSQ3NXGXDsKXIszaODDHjEG/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र:- 200_UMC_769313_1 निविदाकारांची गुणांकन यादी",
        department: "General Administration Department",
        link: "https://drive.google.com/file/d/1JJIqncib2NNtURuQbjdknVtPLVFr2R7N/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "दरपत्रक / निविदा सुचना (विद्यूत विभाग ) दिनांक - १४/०६/२०२२",
        department: "Electrical Engineer Department",
        link: "https://drive.google.com/file/d/1Ll449ReFIIpbjIgCt2jsE0cTs43-YB6C/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र:- 779151_1 पात्र/अपात्र निविदाकारांची माहिती",
        department: "Construction Department",
        link: "https://drive.google.com/file/d/1IsI4gccYgoUnLH4stC1cN4JYsSd3BKq7/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र. 2022_UMC_762051_1 पात्र अपात्र निविदकारांची माहिती",
        department: "PWD Department",
        link: "https://drive.google.com/file/d/1hpEtVKJ_ZW9BlN7-SJ_4wRgyinFq6lHw/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई निविदा क्र 797346_1 पात्र अपात्र माहित प्रसिद्ध करण्याबाबत",
        department: "Store Department",
        link: "https://drive.google.com/file/d/1deopoaNPPE1_gy69BZ6wHw1bSifjre-3/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "उल्हासनगर महानगरपालिकेमधील कार्यरत कर्मचा-यांसाठी 7 वा वेतन आयोगाची अंमलबजावणी व तत्संबंधी कामासाठी (PIS @UMC ) दरपत्रके मागविणेबाबत",
        department: "Accounts Department",
        link: "https://drive.google.com/file/d/1jrj6UbRRI7DY7wMpZ_bSc7H2KPypRdjl/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "विद्युत अभियांत्रिकी विभाग दरपत्रक निविदा सूचना( जाक्र. उमपा/विद्युत/०२/१९,२०,२१,२२ ) दि. २०.०६.२०२२",
        department: "Electrical Engineer Department",
        link: "https://drive.google.com/file/d/1eO2lIh1mrwoTbmcVl8VUQXhKMkRbGcja/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "Tender Notice No. UMC/PWD/Notice/2022-23/1/1",
        department: "PWD Department",
        link: "https://drive.google.com/file/d/1cSh5kYf2pdLeSa1-1JRLbOy_lv9tgviI/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "उल्हासनगर महानगरपालिका क्षेत्रामध्ये साथरोग नियंत्रणाकरिता व आरोग्य सेवा पुरविणेकरिता वैद्यकीय आरोग्य विभागा साठी औषधे खरेदीचे सिलबंद दरपत्रके दि २४/०६/२०२२",
        department: "Public Health Department",
        link: "https://drive.google.com/file/d/1p_ZkvcRXDhVja7VW6fe8Mb5OT7Ykgeod/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "उल्हासनगर-४ प्रभाग क्र. १३ मधील हॉली फॅमिली स्कूल कोरवी इलेक्ट्रॉनिक ते शेखर भालेराव येथे सी.सी. पेव्हमेंट व नाली बनविणे बाबत (दिनांक- ८ जुलै २०२२) ई - निविदा क्र. 2022_UMC_761977_1",
        department: "Construction Department",
        link: "https://drive.google.com/file/d/1JtLx_Yf0ppQQZmH61F2NbjYYUZhrvtGE/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "उल्हासनगर-४ प्रभाग क्र. १३ मधील लाला जाधव हाऊस परिसर ते सरदार पाडा परिसरापर्यंत सी.सी. पेव्हमेंट व नाली बनविणे बाबत (दिनांक- ८ जुलै २०२२) ई - निविदा क्र. 2022_UMC_761631_1",
        department: "Construction Department",
        link: "https://drive.google.com/file/d/1fkYE3hvFJwvvQOCNJxuL6oRAjVYgaIaE/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "उल्हासनगर -४ प्रभाग क्र. १८ मधील संदिप साळवे हाऊस ते ब्रिज पर्यंत सी.सी. पेव्हमेंट व नाली बांधणे बाबत (दिनांक- ८ जुलै २०२२) ई - निविदा क्र. 2022_UMC_793414_1",
        department: "Construction Department",
        link: "#",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र. 2022_UMC_761614_1",
        department: "Construction Department",
        link: "https://drive.google.com/file/d/11uOyPP9u8-0AWXL2TcHXydqDNffJGyFq/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "विद्युत अभियांत्रिकी विभाग दरपत्रक निविदा सूचना( जाक्र. उमपा/विद्युत/०२/२३,२४,२५,२६,२७,२८ ) दि. १२/०७/२०२२",
        department: "Electrical Engineer Department",
        link: "https://drive.google.com/file/d/1wqC4UKh8nBFPxqwzdO7RH77I2ahg30px/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र. 2022_UMC_795685_1",
        department: "Construction Department",
        link: "https://drive.google.com/file/d/11IVyaGekAhqDydreYpoKRo2HlRl6BClS/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई निविदा क्र. 788987_1 पात्र/अपात्र निविदाकारांची माहिती",
        department: "Construction Department",
        link: "https://drive.google.com/file/d/1XSGhCeH93gAYd8mJD4Y4rYBf5ZUhDUWH/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई निविदा क्र. 802207_1 पात्र/अपात्र निविदाकारांची माहिती",
        department: "Construction Department",
        link: "https://drive.google.com/file/d/1NM-IHCNBA5Uw8RDN3U3LEaicusVDc87n/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई निविदा क्र. 766647_1 पात्र/अपात्र निविदाकारांची माहिती",
        department: "Construction Department",
        link: "https://drive.google.com/file/d/1fFfYjfv6X2yNue6tciC2KDM7nY8SdsCl/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई निविदा क्र. 762007_1 पात्र/अपात्र निविदाकारांची माहिती",
        department: "Construction Department",
        link: "https://drive.google.com/file/d/1nhcewld_e2sE1RfvcKI4pxzJxOtvC_DI/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र. 2022_UMC_ 761587_1",
        department: "Construction Department",
        link: "https://drive.google.com/file/d/1fIkJsCT9tjvz84tmGNdTYsRHJTayGJd3/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र. २०२२UMC ७६२०२९_१",
        department: "Construction Department",
        link: "https://drive.google.com/file/d/1vXakuKrQT08D3xNMTC3GsEcahuoPUZnl/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "फेरीवाल्यांचे स्थानावर जावून अंदाजित ५००० बायोमेट्रिक पद्धतीने मोबाईल फेरीवाले. अॅप द्वारे सर्वेक्षण करणे, कागद पत्रे upload करणे, ओळख पत्र आणि प्रमाण पत्र देणे.इ. काम दरपत्रक मागवून करणेबाबत",
        department: "NULM Department",
        link: "https://drive.google.com/file/d/1vkWPAz3OfjUVAfRNHr5R06oq9KNAVXnV/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "डेंग्यू व मलेरिया, चिकणगुनिया रोगाविषयी प्रतिबंधक प्रचार व जनजागृती करण्यासाठी हस्तपत्रके बॅनर्स व पोस्टर छपाई साठी दरपत्रक मगवण्या बाबत",
        department: "Public Health Department",
        link: "#",
        posting: "View PDF"
    },
    {
        tender: "उल्हासनगर महानगरपालिकेच्या वाहनांची दुरूस्तीचे दरपत्रक उपलब्ध करण्या बाबत",
        department: "Vehicle Department",
        link: "https://drive.google.com/file/d/1wLxLG11k-KIThx7FlPat3ZMpNv3oBwJR/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "दरपत्रक/निविदा सुचना जाक्र. उमपा/ विद्युत/ ०२/२९,३०,३१,३२,३३,३४,३५ दिनांक:- ०१/०८/२०२२",
        department: "Electrical Engineer Department",
        link: "https://drive.google.com/file/d/11CxkyNx5lW4hiFWYL4w3WgMvI-SKSRm1/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र. २०२२UMC८१३६६३_१",
        department: "Vehicle Department",
        link: "https://drive.google.com/file/d/1IbTuhPSnGeBriCyFynY4zC409BSF8oz9/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र. २०२२UMC८०३२३४_१",
        department: "Health Department",
        link: "https://drive.google.com/file/d/1drpmreXSNaPt5wqP6bK-Wrl1F34uztjR/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई निविदा क्र २०२२UMC७६१६०१_१",
        department: "Public Work Department",
        link: "https://drive.google.com/file/d/1qN3meB05gYRBimqafzBwRlNog9gt6v3_/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र २०२२UMC७६२०१४_१",
        department: "Public Work Department",
        link: "https://drive.google.com/file/d/1EuvNa1qYMPakrj8-Nm_doWZeILVdgG96/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "फेरीवाल्यांचे स्थानावर जावून बायोमैट्रिक पद्धतीने मोबाईल अप द्वारे सर्वेक्षण करणे, कागद पत्रे upload करणे, ओळख पत्र आणि प्रमाण पत्र देणे.इ. काम दरपत्रक मागवून करणेबाबत",
        department: "NULM Department",
        link: "https://drive.google.com/file/d/1doWDN5O9gExupKPN_fy5y60na2gvXTKx/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र. २०२२UMC७६१५७४_१",
        department: "Public Work Department",
        link: "https://drive.google.com/file/d/1rCdGFY2VsgCJ8186uHrWSdTjWsI_TQeZ/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र. २०२२UMC७६२०२५_१",
        department: "Public Work Department",
        link: "https://drive.google.com/file/d/1GspuilH5WK9_sptvhwbsQQBA8rXXLjx3/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र. २०२२UMC७६१९९३_१",
        department: "Public Work Department",
        link: "#",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र. २०२२UMC७९३४१६_१",
        department: "Public Work Department",
        link: "https://drive.google.com/file/d/1DJuOvw1fPb4XPnJOobFxkkXhxNR3NWYy/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र. २०२२UMC७७९१५२_१",
        department: "Public Work Department",
        link: "https://drive.google.com/file/d/14chwNghtFWyjv6yaCCHVt8e5uJJbYgxS/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "निविदा सुचना जाक्र. उमपा/सार्वजनिक बांधकाम विभाग/२०२२ २३/४/१, २३/३/२, २३/३/३",
        department: "Public Work Department",
        link: "https://drive.google.com/file/d/1FXYyd1cC6hzx2gqSptBlX0VFHm27CSPO/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "निविदा सुचना जाक्र. उमपा/विद्युत/०२/३६ दिनांक :- १८/०८/२०२२",
        department: "Electrical Engineer Department",
        link: "https://drive.google.com/file/d/100RgFgDukyjp4EKjk01L8_duINQXZIzH/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र. २०२२UMC८१०६२७_१",
        department: "Public Work Department",
        link: "https://drive.google.com/file/d/17Wem3XKYZKpq03gtVeiROTC3luAYp6nE/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र. २०२२UMC८०३३९४_१",
        department: "Public Work Department",
        link: "https://drive.google.com/file/d/1FUvLO4rQa5e4IdSOeZDYYzGqYJu0ZlSi/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "निविदा सुचना जाक्र. उमपा/विद्युत/०२/३८ दिनांक :- २२/०८/२०२२",
        department: "Electrical Engineer Department",
        link: "https://drive.google.com/file/d/1n0yEqTAZA-gKZfKipx7vXHpnQ5mLfDbw/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "उल्हासनगर महानगरपालिका क्षेत्रातील नियोजित सण उत्सव कालावधीमध्ये निर्देशित ठिकाणी सी.सी.टि.व्हि. कॅमेरे भाडेतत्वावर उपलब्ध होणेबाबत निविदा सूचना",
        department: "IT Department",
        link: "https://drive.google.com/file/d/1LQqEnHnyXjzocggrlNzt9IecI5t5W4xk/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "निविदा सुचना जाक्र. उमपा/विद्युत/०२/३७,३९,४०,४१,४२,४३",
        department: "Electrical Engineer Department",
        link: "#",
        posting: "View PDF"
    },
    {
        tender: "सन २०२२ /२३ करिता जंतुनाशके / किटकनाशके / दुर्गंधीनाशके / अळीनाशके / डासनाशके व इतर औषधे / रसायने पुरवठा करून घेण्याबाबत ई-निविदा सूचना",
        department: "Health Department",
        link: "https://drive.google.com/file/d/1Od1sYIuBvM5zZoCf8n_LIzlJEz_SmJFX/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "निविदा सुचना जाक्र. उमपा/विद्युत/०२/४४,४५,४६,४७ दिनांक :- ०२/०९/२०२२",
        department: "Electrical Engineer Department",
        link: "https://drive.google.com/file/d/1aqw4vb0XyYpDDNgrY-ikXDfhKjWbtpOl/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "निविदा क्र. २०२२UMC८३०५०६_१",
        department: "Health Department",
        link: "https://drive.google.com/file/d/1o3sZP_2wuiods7JBoELwGgrTM9R5DjNU/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्र. २०२२UMC७६५९३११ व २०२२_UMC७७१३०६_१",
        department: "Public Work Department",
        link: "https://drive.google.com/file/d/186kW39MoVXyXtskliFPJtwW7QDD14YT6/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "उल्हासनगर महानगरपालिका क्षेत्रात स्वच्छ अमृत अभियान अंतर्गत राबविण्यात येणाऱ्या विविध योजनांचे नियोजनपध्दतीने मांडणी करुन नागरीकांपर्यंत पोहचविण्यासाठी \"मीडिया पार्टनर\" नियुक्ती करणेबाबत",
        department: "Sanitation Department",
        link: "https://drive.google.com/file/d/1t8sJWnjfrMcRwdQa_fdaX9SrN8EgzsBc/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई निविदा क्र. 2022_UMC _776942_1 पात्र अपात्र निविदाकारांची माहिती",
        department: "Public Work Department",
        link: "#",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्रं. २०२२_UMC_८१५१२७_१ व २०२२ UMC_८१५१२८_१",
        department: "Public Work Department",
        link: "https://drive.google.com/file/d/1v-EpyLubjTUzBYCTx1IAqVo5wzsIy9HW/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "महापालिकेच्या संकेतस्थळावर पात्र/अपात्र उमेदवारांची यादी प्रसिध्द करणेबाबत.",
        department: "General Administration Department",
        link: "https://drive.google.com/file/d/1B8jqXMPxouxSDXSetQrg19H-Szix9g6s/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "महापालिकेच्या संकेतस्थळावर पात्र उमेदवारांची यादी प्रसिध्द करणेबाबत.",
        department: "General Administration Department",
        link: "https://drive.google.com/file/d/1JRqwv6KYYyM1uM4UfYykPiLoK0YPeoTT/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "ई-निविदा क्रं. २०२२_UMC_८३३८५०_१ पात्र/अपात्र निविदाकारांची माहिती",
        department: "Public Work Department",
        link: "https://drive.google.com/file/d/1UVT2_YUW7anzdKGqjm06Fwrrg2c4zMvH/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "अभय योजना २०२२ -२०२३\" जनजागृतीच्या अनुषंगाने उपाययोजना करणे.",
        department: "Property Tax Department",
        link: "https://drive.google.com/file/d/1CT1Ca-z5SeKxGoyxm7TNUTxwrpk4JYuU/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "निविदा सुचना जाक्र. उमपा/विद्युत/०२/४८,४९,५०,५१,५२,५३,५४,५५,५६ दिनांक :- ३१/१०/२०२२",
        department: "Electrical Engineer Department",
        link: "https://drive.google.com/file/d/1TB7YSOiCO1ksFlH7-msodfNNoEXsnYO-/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "दरपत्रक सुचना जाक्र. उमपा वाहन १२५,१२६,१२७ दिनांक ०१-११-२०२२",
        department: "Vehicle Department",
        link: "https://drive.google.com/file/d/1qDQo8sMRLX43tthIkYPx3Pt98oKVAjMp/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "उल्हासनगर महानगरपालिकेत निरुपयोगी संगणक व संगणकीय साहित्याची विल्हेवाट लावणेबाबत.",
        department: "IT Department",
        link: "https://drive.google.com/file/d/1h0eM_1TYJcZdtZ0lc5KbWcN5eWe9H9Av/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "०१/०१/२०२३ या अर्हता दिनांकावर आधारित छायाचित्रासह मतदार यादीचा विशेष संक्षिप्त पुनरिक्षण कार्यक्रम.",
        department: "Election Department",
        link: "https://drive.google.com/file/d/1KmEVP1CW43F0NCajxupsbLm8-Rr9F1a3/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "उल्हासनगर महानगरपालिका क्षेत्रात बस सेवा/परिवहन सेवा सुरू करणेकरीता तांत्रिक सल्लागाराची नियुक्ती करणेबाबत दरपत्रक नोटीस दि. १८.११.२०२२",
        department: "Vehicle Department",
        link: "#",
        posting: "View PDF"
    },
    {
        tender: "निविदा सुचना जाक्र. उमपा/विद्युत/०२/६५,५७,६०,६२,६३,६६. दिनांक :- २४/११/२०२२",
        department: "Electrical Engineer Department",
        link: "https://drive.google.com/file/d/1IT2fTLoVCH8wntGpFoemPAG-LdoGIMnb/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "०२ ऑगस्ट २०२४ -निविदा सूचना - उमपा/विद्युत/०२/२९,३०,३१,३२,३३,३४,३५,३६,३७,३८,३९,४० .",
        department: "Electrical Engineer Department",
        link: "https://drive.google.com/file/d/1o-niipMCz9S5q0nNQe7npuAaKOyVMoB6/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "९ ऑगस्ट २०२४ -दरपत्रक नोटीस -उल्हासनगर महानगरपालिका क्षेत्रातील असलेल्या जाहिरात फलकाबाबत सर्वेक्षण करणेबाबत.",
        department: "Public Work Department",
        link: "https://drive.google.com/file/d/1CJK2aqkrmvt1XMhZMKpM49zYHrK5EywE/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "१२ ऑगस्ट २०२४ -दरपत्रक नोटीस -दुकान नोंदणी प्रमाणपत्र असलेल्या पुरवठा दाराकडून नमूद औषधे व साहित्य पुरवठा करण्यासाठी सीलबंद दरपत्रके मागविण्यात येत आहेत.",
        department: "Medical Health Department",
        link: "https://drive.google.com/file/d/1VHoDV8KQBAUtxR-lozrYDS5ycALjVBdg/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "१४ ऑगस्ट २०२४ -निविदा सूचना - उमपा/विद्युत/०२/४१.,४२,४३,४४,४५,४६,४७,४८,४९ .",
        department: "Electrical Engineer Department",
        link: "https://drive.google.com/file/d/1r7JEN0ijUJdrX2vNo6hj5jeGUBhKx8Z1/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "१६ ऑगस्ट २०२४ -उल्हासनगर महानगरपालिका वाहन विभागातील वाहन क्र. एम एच ०५ पी ६८ (व्हॅन) वाहनाचे दुरुस्तीचे काम करून मिळणेबाबत.",
        department: "Vehicle Department",
        link: "https://drive.google.com/file/d/1ntY9VOBXIXRVKDHopU7eqOwG0cjz9oNk/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "१९ ऑगस्ट २०२४ -अभिव्यक्ती स्वारस्य (EOI)- Invites Expression of Interest for TB related services as Chest Physician for T.B. OPD at central Hospital Ulhasnagar-3(DR-TB OPD services).",
        department: "Medical Health Department",
        link: "https://drive.google.com/file/d/1piv-on-dvTnTadspe1P3vhTSjk8vCrVK/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "२० ऑगस्ट २०२४ -निविदा सूचना - उमपा/विद्युत/०२/५०,५१,५२,५३,५,४,५५,५६,५७ .",
        department: "Electrical Engineer Department",
        link: "https://drive.google.com/file/d/1zJnq3fMAkgnJ5fKIh2DqYcvPA01sKqe_/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "२६ ऑगस्ट २०२४ -सुका कचरा विलगीकृत करून प्रति दिन मानधन तत्वावर देणेबाबत.",
        department: "Public Health Department",
        link: "https://drive.google.com/file/d/1-DVH_Eg9nOHNStAf6kEc5jZyxWF-ZKsY/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "२८ ऑगस्ट २०२४ -उल्हासनगर महानगरपालिका वाहन विभागातील वाहन क्र. एम एच ०५ पी ११६(बोलेरो)वाहनाचे दुरुस्तीचे काम करून मिळणेबाबत.",
        department: "Vehicle Department",
        link: "https://drive.google.com/file/d/1fCwO2T9WcSODa13fNsHIlAEMndMGYf53/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "३० ऑगस्ट २०२४ -निविदा सूचना UMC/PWD/Notice/2024-25/10/1, 2, 3, 4, 5, 6, 7, 8, 9, 10.",
        department: "Public Work Department",
        link: "https://drive.google.com/file/d/1RDj91NEVMQPU2aN46Sjx9O5aVwjG5Doh/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "११ सप्टेंबर २०२४ -नटाटा आमंत्रा, भिवंडी येथे कोव्हीड-१९ कालावधीत ठेवण्यात आलेले साहित्य स्थलांतरीत करणेबाबत.",
        department: "Store Department",
        link: "https://drive.google.com/file/d/10vDrSqO5qnV7H_Cb22efVQgMj-vKImsb/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "१२ सप्टेंबर २०२४ - Providing Shed for Maintenance of UMT buses at Ajmera Charging station, Shahad, Ulhasnagar-1 (Attendance shed development)",
        department: "Public Work Department",
        link: "https://drive.google.com/file/d/18XNURSRWef_gMwZ76f_sj8G9VoirY5H1/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "२० सप्टेंबर २०२४ -निविदा सूचना UMC/PWD/Notice/2024-25/5/1, 2, 3, 4, 5.",
        department: "Public Work Department",
        link: "https://drive.google.com/file/d/1xEDQqC2RxctjvbZApVXauaRDvrf-RjAb/view?usp=drive_link",
        posting: "View PDF"
    },
    {
        tender: "२० सप्टेंबर २०२४ -निविदा सूचना UMC/PWD/Notice/2024-25/4/1.",
        department: "Public Work Department",
        link: "https://drive.google.com/file/d/1keSAsJ1D78mfpJ4e8BnzFtUimouW4V3D/view?usp=drive_link",
        posting: "View PDF"
    }
];

const TendersQuotations = () => {
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const filteredData = circularData.filter((item) =>
        item.tender.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
                pageNumbers.push(
                    <li
                        key={i}
                        className={`page-item ${currentPage === i ? "active" : ""}`}
                        onClick={() => handlePageChange(i)}
                    >
                        <button className="page-link">{String(i).padStart(2, "0")}</button>
                    </li>
                );
            } else if (
                pageNumbers[pageNumbers.length - 1]?.key !== "ellipsis" &&
                (i < currentPage - 1 || i > currentPage + 1)
            ) {
                pageNumbers.push(
                    <li key="ellipsis" className="page-item ellipsis">
                        <span className="page-link">...</span>
                    </li>
                );
            }
        }
        return pageNumbers;
    };

    const handleClick = (link, e) => {
        if (link === "#") {
            e.preventDefault();
            Swal.fire({
                title: 'Information',
                text: 'The PDF will be available soon.',
                icon: 'info',
                confirmButtonText: 'Ok'
            });
        }
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <>
            <div className="history-header-image"></div>

            <div id="main-content">
                <div className="container-fluid font-location mt-4 mb-5" id="tender-css">
                    <nav className="breadcrumb">
                        <Link to="/" className="breadcrumb-item text-decoration-none">
                            Home
                        </Link>
                        <Link to="#" className="breadcrumb-item text-decoration-none">
                            Citizen Services
                        </Link>
                        <span className="breadcrumb-item active1">Tenders & Quotations</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">Tenders</span>
                        <span className="highlighted-text"> and Quotations</span>
                        <hr />
                    </h2>
                    
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="entries-wrapper">
                            <label htmlFor="entries" className="entries-label">
                                Show
                            </label>
                            <select
                                id="entries"
                                className="entries-select"
                                value={itemsPerPage}
                                onChange={handleItemsPerPageChange}
                            >
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                            <span className="entries-text">entries</span>
                        </div>

                        <div className="input-group d-flex align-items-center" style={{ width: "270px" }}>
                            <label
                                htmlFor="searchInput"
                                className="search-label"
                                style={{
                                    whiteSpace: "nowrap",
                                }}
                            >
                                Search
                            </label>
                            <input
                                type="text"
                                id="searchInput"
                                className="form-control serching-shorting"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="row mt-4 row-styling-3">
                        <div className="col-12">
                            <div className="circular-wrapper">
                                <table className="table table-bordered shadow table-responsive">
                                    <thead className="bg-orange text-white">
                                        <tr>
                                            <th className="table-heading-styling text-center" width='8%'>Sr. No.</th>
                                            <th className="table-heading-styling" width='60%'>Quotations / Tenders Details</th>
                                            <th className="table-heading-styling">Department</th>
                                            <th className="table-heading-styling text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.map((item, index) => (
                                            <tr key={index}>
                                                <td className="font-large text-center">
                                                    {startIndex + index + 1}
                                                </td>
                                                <td style={{ textWrap: "pretty" }}>{item.tender}</td>
                                                <td>{item.department}</td>
                                                <td className="text-center">
                                                    <Link
                                                        to={item.link}
                                                        className="text-decoration-none"
                                                        target={item.link === "#" ? "" : "_blank"}
                                                        style={{ color: "#333333" }}
                                                        onClick={(e) => handleClick(item.link, e)}
                                                    >
                                                        <img
                                                            src={pdficon}
                                                            alt="PDF Icon"
                                                            style={{
                                                                width: "18px",
                                                                height: "18px",
                                                                marginRight: "8px",
                                                                verticalAlign: "middle",
                                                            }}
                                                        />
                                                        {item.posting}
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <nav aria-label="Page navigation" className="d-flex justify-content-start">
                            <ul className="pagination custom-pagination">
                                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                    >
                                        Previous
                                    </button>
                                </li>
                                {renderPageNumbers()}
                                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                    >
                                        Next
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>

                </div>
            </div>
        </>
    );
};

export default TendersQuotations;

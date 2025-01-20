import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./PressNote.css";
import "../DepartmentCustomCss/DepartmentCustom.css";
import "../TableCss/TableCss.css";
import pdficon from '../../assets/images/Departments/document 1.png';
import Swal from "sweetalert2";

const notes = [
    { description: "प्रेसनोट -१० जानेवारी २०२५ - पर्यावरणाची हानी टाळण्यासाठी व पक्षी, मानवी जिवीतास दुखापत होऊ नये म्हणून नायलॉन मांज्याचा वापर करू नये व वापराच्या दुष्परिणामाबाबत जनजागृती करावी. ", link: "https://drive.google.com/file/d/1R3YsYGv-4jPqakv6s2cEuDTTbeTx0VqA/view?usp=drive_link", action: "View PDF" },
    { description: "प्रेसनोट -८ जानेवारी २०२५ - १३ जानेवारी २०२५ रोजी ADIP योजने अंतर्गत दिव्यांगजनांना व RVY योजने अंतर्गत जेष्ठ नागरिकांना साहित्य मिळणार आहे त्या बाबत माहिती. ", link: "https://drive.google.com/file/d/1YQxnfMWWRl6ixjUIuYNJ87ZqGGjVj1be/view?usp=drive_link", action: "View PDF" },
    { description: "प्रेसनोट -८ जानेवारी २०२५ - पर्यावरणाची हानी टाळण्यासाठी व पक्षी, मानवी जिवीतास दुखापत होऊ नये म्हणून नायलॉन मांज्याचा वापर करू नये व वापराच्या दुष्परिणामाबाबत जनजागृती करावी. ", link: "https://drive.google.com/file/d/1R5e4X_qRAIOU61vUJdMhRoqoufaH4y3U/view?usp=drive_link", action: "View PDF" },
    { description: "प्रेसनोट -७ जानेवारी २०२५ - मा.महापालिका प्रशासक तथा आयुक्त श्री. विकास ढाकणे , मा. अतिरिक्त आयुक्त श्री.जमीर लेंगरेकर यांच्या मार्गदर्शनाखाली \"पत्रकार दिन \" दि. ०६/०१/२०२५ रोजी आयोजित करण्यात आला. ", link: "https://drive.google.com/file/d/168qC-seT-0ktbohirakGADFp41bmzyEo/view?usp=drive_link", action: "View PDF" },
    { description: "प्रेसनोट- २४ डिसेंबर २०२४-उल्हासनगर शहरातील वाहतूक समस्येबाबत मा.महापालिका प्रशासक तथा आयुक्त श्री. विकास ढाकणे यांनी बैठक आयोजित करून मा. आमदार श्री.कुमार आयलानी व वाहतूक शाखेचे पोलीस उप-आयुक्त सदर विषयांवर चारचा करून कार्यवाहीची दिशा ठरविण्यात आली. ", link: "https://drive.google.com/file/d/168qC-seT-0ktbohirakGADFp41bmzyEo/view?usp=drive_link", action: "View PDF" },
    { description: "प्रसिद्धी पत्रक - १७ डिसेंबर २०२४-मा.महापालिका प्रशासक तथा आयुक्त श्री. विकास ढाकणे यांच्या आदेशानुसार व मा. अतिरिक्त आयुक्त श्री.जमीर लेंगरेकर यांच्या मार्गदर्शनाने पर्यावरण विभागामार्फत पर्यावरणाचे संवर्धन करणे व प्रदूषण नियंत्रण कारणेविषयक जनजागृती उपक्रमाअंतर्गत सेंच्युरी रेयॉन हायस्कूल मध्ये निबंध व पोस्टर मेकिंग स्पर्धा घेण्यात आली होती. ", link: "https://drive.google.com/file/d/1RS1ML_Ira1oXY_RdyNy74G358f4QqSQR/view?usp=drive_link", action: "View PDF" },
    { description: "प्रसिद्धी पत्रक - १७ डिसेंबर २०२४-उल्हासनगर शहरातील मुख्य रस्त्यांवरील बेवारस वाहनांविरुद्ध कारवाई. ", link: "https://drive.google.com/file/d/1troOrUI7Q8U7vZuoWhWvrJpqwILiLG3g/view?usp=drive_link", action: "View PDF" },
    { description: "प्रेसनोट - 3 डिसेंबर २०२४ - मा.महापालिका प्रशासक तथा आयुक्त श्री. विकास ढाकणे यांनी दि.०२/१२/२०२४ रोजी शहरातील क्रीडा प्रशिक्षक.क्रीडा शिक्षक यांचेशी खेळ व मैदानाबाबत समस्यांवर चर्चा केली व लवकरात लवकर खेळांसाठी सुविधा उपलब्ध करून देण्याचे आश्वासित केले आहे. ", link: "https://drive.google.com/file/d/1VUeciVr5QON4SoYu2ttpWlmsBF6teCIb/view?usp=drive_link", action: "View PDF" },
    { description: "प्रेसनोट - 3 डिसेंबर २०२४ - \"उपराष्ट्रीय पल्स पोलिओ लसीकरण मोहिमेकरिता\" CTF बैठकीत अध्यक्ष मा. श्री. विकास ढाकणे, प्रशासक तथा आयुक्त यांनी चर्चा करून महत्वाच्या सूचना दिल्या. ", link: "https://drive.google.com/file/d/1QOF9Z2RN9CClmnD4ET2ybuiS800mhYlU/view?usp=drive_link", action: "View PDF" },
    { description: "प्रेसनोट - २७ नोव्हेंबर २०२४ - -मा.महापालिका प्रशासक तथा आयुक्त श्री. विकास ढाकणे यांनी दि.२५/११/२०२४ रोजी सर्व प्रभाग समिती सहाय्यक आयुक्तांना त्यांचे कार्यक्षेत्रातील अनधिकृत फलक लावणाऱयांविरोधात कठोर कार्यवाही करण्याचे आदेश दिलेले आहेत. ", link: "https://drive.google.com/file/d/1cGNz4irP8oUFwumEhWAAVQzrmtdfYILx/view?usp=drive_link", action: "View PDF" },
    {
        description: "प्रेसनोट - २६ नोव्हेंबर २०२४ - उल्हासनगर महानगरपालिका व बोधी फाऊंडेशन यांचे संयुक्त विद्यमाने संविधान निर्मितीचा अमृत महोत्सव दि.२६ नोव्हेंबर २०२४ रोजी आयोजित करण्यात आला. ",
        link: "https://drive.google.com/file/d/1QdYzlS5PQopKHo3y88T1x1l8gJxMOnh-/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - २२ नोव्हेंबर २०२४ - उल्हासनगर महानगरपालिका व बोधी फाऊंडेशन यांचे संयुक्त विद्यमाने संविधान निर्मितीचा अमृत महोत्सव दि.२६ नोव्हेंबर २०२४ रोजी आयोजित केला आहे. ",
        link: "https://drive.google.com/file/d/1RWZVmzk0SzaHZ2triihESX9oHU7v8F53/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - ८ नोव्हेंबर २०२४ -मा.महापालिका प्रशासक तथा आयुक्त श्री. विकास ढाकणे यांच्या आदेशानुसार व मा. अतिरिक्त आयुक्त डॉ. किशोर गवस यांच्या मार्गदर्शनानुसार छट पूजा महोत्सवाचे औचित्य साधून दि. ०८ नोव्हेंबर २०२४ रोजी, हिराघाट बोट क्लब, उल्हासनगर-३ येथे विधानसभा सार्वत्रिक निवडणूक २०२४ मध्ये जास्तीत जास्त मतदान करणेबाबत आवाहन करून मतदान जनजागृती करण्यात आली व मतदान शपथ घेण्यात आली. ",
        link: "https://drive.google.com/file/d/1V2Pv5x-QCwA2959iBgCRiT-sYwomjaRv/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - २५ ऑक्टोबर २०२४ -उल्हासनगर महानगरपालिका दिव्यांग कल्याणकारी योजना विभागाच्या वतीने सर्व दिव्यांग लाभार्थ्याच्या खात्यात प्रोत्साहन अनुदान जमा करण्यात आले. ",
        link: "https://drive.google.com/file/d/1KoBhlZiWdoMuDSGuvQGfXdlR1nyzaMKW/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - २३ ऑक्टोबर २०२४ -तात्पुरत्या मंडपासंदर्भात प्राप्त परवानगी पत्रातील अटींच्या उल्लंघनाबाबत उचित कार्यवाही होण्यासाठी महापालिकेच्या प्रभाग समिती स्तरावर समिती गाठीत करण्यात आली आहे. ",
        link: "https://drive.google.com/file/d/1S_PU_YoclAVHEGz5RBaC5Rgq883CmTku/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - १५ ऑक्टोबर २०२४ -प्रशासकीय गतिमानता वाढणेसाठी वर्ग ३ व वर्ग ४ कर्मचाऱयांची बदली करण्यात आली तसेच काही कर्मचाऱयांना पदोन्नती देण्यात आली. ",
        link: "https://drive.google.com/file/d/1awgsaDlTrXhxSi6SB_oFeRDYJPc_HSHu/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - १४ ऑक्टोबर २०२४ -मा.महापालिका प्रशासक तथा आयुक्त श्री. विकास ढाकणे यांनी महापालिका अधिकारी/कर्मचारी यांना प्रत्येकी रुपये १७०००/- सानुग्रह अनुदान म्हणून सर्वानुमते देण्याचे मंजूर केले. ",
        link: "https://drive.google.com/file/d/1cQ4sqqaeegMUGwlscOaziqmr7AGZt2kq/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - १० ऑक्टोबर २०२४ -मा.आयुक्त तथा प्रशासक यांच्या अध्यक्षतेखाली महापालिकेच्या उत्पन्नाचे प्रमुख स्रोत असलेल्या मालमत्ता कर, पाणीपट्टी व नगर रचना विभागाकडून उत्पन्न वाढीबाबत चर्चा करण्यात आली. ",
        link: "https://drive.google.com/file/d/1Bo5iUx5dBbmDkqrz1rXFxnQag-ywogis/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - ८ आक्टोबर २०२४ -दि. ०४/१०/२०२४ रोजी मुंबई महानगर प्रदेश विकास प्राधिकरण तर्फे सुरु करण्यात आलेल्या ७ रस्त्यांच्या कामाबाबत मा.आयुक्त यांच्या अध्यक्षतेखाली बैठक आयोजित करण्यात आली. ",
        link: "https://drive.google.com/file/d/18P4YSVacw9zPcc1iHg13sIsU4owS5P-2/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - १ आक्टोबर २०२४ - मा.महापालिका प्रशासक तथा आयुक्त श्री. विकास ढाकणे यांच्या मार्गदर्शनाखाली स्वच्छ भारत अभियान २.० अंतर्गत स्वच्छता ही सेवा २०२४ या मोहीमे अंतर्गत, उल्हासनगर महापालिकेच्या वतीने व विविध स्वयंसेवी संस्था यांच्या सहभागाने ३० सप्टेंबर २०२४ रोजी मेगा स्वच्छता अभियान राबविण्यात आले. ",
        link: "https://drive.google.com/file/d/16bgvyv2cs9zBS-2Cc2I4OeFwUphkbEYL/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - १ आक्टोबर २०२४ - निवडणूक विषयक प्रचार प्रसिद्धी करणे कामी प्रत्येक महाविद्यालयामध्ये Campus Ambassadors व Co-Ordinator यांची नेमणूक करण्यात आली आहे. ",
        link: "https://drive.google.com/file/d/1wgOuBMyl52JM-9rBofgi-Xk8vTza52tQ/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट -२७ सप्टेंबर २०२४ - मा.महापालिका प्रशासक तथा आयुक्त श्री. विकास ढाकणे यांनी उल्हासनगर महापालिका क्षेत्रातील मनपा शाळा क्र. १३,१४,१९,५ व २९ या शाळांना भेट देऊन शैक्षणिक गुणवत्तेचा व उपलब्ध सोयी सुविधांचा आढावा घेतला. ",
        link: "https://drive.google.com/file/d/1MTn4M4v5P_9w-Ve-VUQPn5QOginN59us/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट -२६ सप्टेंबर २०२४ - मा.महापालिका प्रशासक तथा आयुक्त श्री. विकास ढाकणे यांच्या मार्गदर्शनाखाली स्वच्छ भारत अभियान २.० अंतर्गत स्वच्छता ही सेवा या मोहीम अंतर्गत, सफाई मित्र सुरक्षा शिबिर (स्वच्छता कर्मचारी यांचेसाठी आरोग्य तपासणी शिबीर) चे नियोजन करण्यात आले. ",
        link: "https://drive.google.com/file/d/1CvIV-wd2rky45zbg2M4D0T4OASd5PLnA/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट -२५ सप्टेंबर २०२४ - मा.महापालिका प्रशासक तथा आयुक्त श्री. विकास ढाकणे यांच्या मार्गदर्शनाखाली स्वच्छ भारत अभियान २.० अंतर्गत स्वच्छता ही सेवा या मोहीम अंतर्गत, सफाई मित्र सुरक्षा शिबिर (स्वच्छता कर्मचारी यांचेसाठी आरोग्य तपासणी शिबीर) चे नियोजन करण्यात आले. ",
        link: "https://drive.google.com/file/d/1MC-hjXKHEq5bEnd09BxYnsEG3zSnuqOX/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट -२३ सप्टेंबर २०२४ - मा.महापालिका प्रशासक तथा आयुक्त श्री. विकास ढाकणे यांच्या मार्गदर्शनाखाली \"चला जाणूया नदीला\" अभियानाअंतर्गत उल्हास नदीच्या किनाऱ्यावर नदी की पाठशाला, नदी किनारी स्वच्छता अभियान तसेच वृक्षारोपण कार्यक्रमाचे नियोजन करण्यात आले. ",
        link: "https://drive.google.com/file/d/1yw-mwiUOhqxseRNAHrAKMgh3WxOTEkmW/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट -१९ सप्टेंबर २०२४ - स्वच्छ भारत अभियान २.० अंतर्गत \"स्वच्छता ही सेवा २०२४\" स्वभाव स्वच्छता- संस्कार स्वच्छता अभियान मा.महापालिका प्रशासक तथा आयुक्त श्री. विकास ढाकणे यांच्या मार्गदर्शनाखाली राबविण्यात आले.",
        link: "https://drive.google.com/file/d/1oW0MslnhPFQwiiVF3W3pAP4HWUF_sAzP/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट -१२ सप्टेंबर २०२४ - दिव्यांग कल्याणकारी योजना विभागाच्या वतीने महापालिका क्षेत्रातील दिव्यांग लाभार्थ्यांच्या खात्यात प्रोत्साहन अनुदान (पेन्शन) जमा करण्यात आले आहे. ",
        link: "https://drive.google.com/file/d/1NxalKhVAP9J0odeOE24ymOqnSUKeiOhZ/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट -१२ सप्टेंबर २०२४ - मा.महापालिका प्रशासक तथा आयुक्त श्री. विकास ढाकणे यांनी कल्याण बदलापूर रोडची पाहणी करून दुभाजक दुरुस्ती,खड्डे भरणे, अनधिकृत वाहन हटविणे, रंगरंगोटी, दुभाजकांमधील खराब झाडे काढून नवीन झाडे लावणे इत्यादी बाबतीत उपस्थित अधिकारी यांना निर्देश दिले. ",
        link: "https://drive.google.com/file/d/1cpjAruGPtA7J49HCAq_a_M7Fu3PTqVlm/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट -६ सप्टेंबर २०२४ - उल्हासनगर कार्यक्षेत्रातील शाळांमधील विद्यार्थी/विद्यार्थिनीच्या सुरक्षा विषयक उपाययोजनांची अंमलबजावणी करण्याच्या दृष्टीने मनपा क्षेत्रातील सर्व माध्यमांच्या शाळा व महाविद्यालये यांचे मुख्याध्यापक तसेच त्यांचे संस्थाचे प्रतिनिधी यांचे बैठकीचे आयोजन शिक्षण विभाग,उल्हासनगर महानगरपालिका यांचे मार्फत दि. ४ सप्टेंबर २०२४ रोजी करण्यात आले होते. ",
        link: "https://drive.google.com/file/d/1piF2yOhXPIoo8jibWJ4w2aGM4htUKZzc/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट -५ सप्टेंबर २०२४ - मा.महापालिका प्रशासक तथा आयुक्त श्री. विकास ढाकणे यांच्या मार्गदर्शनाखाली सिंधू भवन सपना गार्डन उल्हासनगर-३ येथे ३ सप्टेंबर २०२४ रोजी दिव्यांग कला सांस्कृतिक महोत्सव साजरा करण्यात आला. ",
        link: "https://drive.google.com/file/d/10pKrmxMEwC7OmfqIPIKL57qWzeODdAA8/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट -४ सप्टेंबर २०२४ - पर्यावरण पूरक गणेश सजावट स्पर्धेमध्ये सहभागी होण्यासाठी नागरिकांना (घरगुती व सार्वजनिक गणेश उत्सव मंडळांकरिता) आवाहन करण्यात येत आहे. ",
        link: "https://drive.google.com/file/d/102wvva3_ZyPtr7O3yLG7HLtKfutmKyz1/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट -२ सप्टेंबर २०२४ - मा.श्री.विकास ढाकणे यांची महापालिका प्रशासक तथा आयुक्त पदी नियुक्ती झाल्याने डॉ.अझीझ शेख यांना उल्हासनगर महानगरपालिकेमार्फत सर्व अधिकारी/कर्मचारी यांच्या वतीने निरोप देण्यात आला. ",
        link: "https://drive.google.com/file/d/16AJnuVCYuRUVVeLNqg_mOOGQQEDd521Z/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट -३० ऑगस्ट २०२४ - जिल्हा स्तरीय क्रीडा स्पर्धा २०२४-२५ दि. ३० ऑगस्ट २०२४ ते डिसेंबर २०२४ पर्यंतचे आयोजन मा. महापालिका प्रशासक तथा आयुक्त श्री. विकास ढाकणे यांच्या मार्गदर्शनानुसार करण्यात येऊन बुद्धिबळ खेळापासून एस.एस.टी कॉलेज,उल्हासनगर-४ येथून सुरुवात करण्यात आली. ",
        link: "https://drive.google.com/file/d/1rRvMqNgC8tXRcRDOEKVMc8isZjef8_Ox/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट -२६ ऑगस्ट २०२४ - २६ ऑगस्ट २०२४ ते २८ ऑगस्ट २०२४ रोजी पर्यंत पर्यावरणपूरक गणेशमूर्ती तसेच पर्यावरणपूरक आकर्षक सजावट साहित्यांचे प्रदर्शन भरविले बाबत. ",
        link: "https://drive.google.com/file/d/1MQ8LUV9H6CE3CwRfpLhlRKrGNRMtGyoE/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट -१४ ऑगस्ट २०२४ - \"घरोघरी तिरंगा\" या अभियाना अंतर्गत दि. १४/०८/२०२४ रोजी उल्हासनगर महानगरपालिकेच्या प्रांगणात असलेल्या शिलालेखाचे पूजन करून \"तिरंगा प्रतिज्ञा\" घेण्यात आली. ",
        link: "https://drive.google.com/file/d/1BbrdJQA-bgm6AkLK92f8mRcHXSIxNtAk/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट -१३ ऑगस्ट २०२४ - मा. महापालिका प्रशासक तथा आयुक्त डॉ.अजीज शेख यांच्या मार्गदर्शनानुसार उल्हासनगर महानगरपालिका शाळांतील विद्यार्थ्यानकरीता मातीपासून गणेश मूर्ती तयार करण्याची कार्यशाळा आयोजित करण्यात आली होती. ",
        link: "https://drive.google.com/file/d/1Y4QE20hEIJeA5ygvL_T1dW_r_oH6Zoxb/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - १२ ऑगस्ट २०२४ - \"घरोघरी तिरंगा\" या अभियाना अंतर्गत दि. १२/०८/२०२४ रोजी महिला बाईक रॅलीचे आयोजन करण्यात आले. ",
        link: "https://drive.google.com/file/d/1D0JxkmzcUrjCtLROwBLMNYbyxI4e1Tme/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - १२ ऑगस्ट २०२४ - रस्त्यांवरील खड्डे भरणेकामी आधुनिक तंत्रज्ञानाचा वापर करून खड्डे भरण्याचे कामास सुरुवात करण्यात आली. त्या कामाची पाहणी दि. १२ ऑगस्ट २०२४ रोजी मा. महापालिका प्रशासक तथा आयुक्त डॉ.अजीज शेख यांनी केली. ",
        link: "https://drive.google.com/file/d/1s1gFzdTqtR9X-7TZ-5Bt74_93xpmYD5Y/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट -९ ऑगस्ट २०२४ - सण/उत्सव कालावधी सुरु होत असल्याने पावसाळ्यामुळे होणारी रस्त्यांची स्थिती, नागरिकांची असलेली वर्दळ, नवीन रस्त्यांचे बांधकाम याचहा आढावा घेणेसाठी दि. ०९/०८/२०२४ रोजी मा. महापालिका प्रशासक तथा आयुक्त डॉ.अजीज शेख यांनी मुख्य रस्त्यांची पाहणी केली. ",
        link: "https://drive.google.com/file/d/1iRneCxewvFOjBlxA8IDtz7yFU6cgh5pr/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट -९ ऑगस्ट २०२४ - उल्हासनगर महानगरपालिकेतर्फे महापालिकेचे अधिकारी, कर्मचारी मनपा शाळेचे विद्यार्थी, बचत गट महिला यांचे सहभागातून सिडबॉल तयार करण्याचा कार्यक्रम आयोजित करण्यात आला . ",
        link: "https://drive.google.com/file/d/1k6pQWVO5IlTgf_iwrqjSmFnQvKzjXAiU/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट -८ ऑगस्ट २०२४ - उल्हासनगर शहर स्थापना दिनाचा ७५ वा वर्धापन दिन समारंभ दि.०८ ऑगस्ट २०२४ रोजी मा. महापालिका प्रशासक तथा आयुक्त डॉ.अजीज शेख यांच्या अध्यक्षतेखाली आयोजित करण्यात आला. ",
        link: "https://drive.google.com/file/d/1IeXjhRQg0cepI7AieRoGlS4dHh9i-89Y/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट -७ ऑगस्ट २०२४ -\"घरोघरी तिरंगा\" अभियानास सुरुवात होणार असून दि. १३ ते १५ ऑगस्ट दरम्यान घरोघरी राष्ट्रध्वज लावणेबाबत शासनाचे निर्देश आहेत व तिरंगा सोबत आपला सेल्फी फोटो \"harghartiranga.com\" या वेबसाइट वर अपलोड करावा. ",
        link: "https://drive.google.com/file/d/1PDWdwWAym8UNkr08W1kd5OIC534ao7Yl/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट -५ ऑगस्ट २०२४ -राष्ट्र्रीय क्षयरोग दुरीकरण कार्यक्रम - प्रधानमंत्री टी.बी मुक्त भारत अभियान अंतर्गत निक्षय मित्र नोंदणीबाबत. ",
        link: "https://drive.google.com/file/d/1dWg8M8YYC7-7XzC1WZ6acLw08zlUsFpq/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट -१ ऑगस्ट २०२४ -उल्हासनगर महानगरपालिका भारतरत्न डॉ.बाबासाहेब आंबेडकर अभ्यासिका येथे दि. ०१ ऑगस्ट २०२४ रोजी दुपारी १२:०० वाजता लोकशाहीर अण्णाभाऊ साठे यांची जयंती तसेच लोकमान्य बाळ गंगाधर टिळक यांच्या पुण्यतिथी निमित्त कार्यक्रम आयोजित करण्यात आला. ",
        link: "https://drive.google.com/file/d/11YaqM1Abd-8p905JOKisLhk3BZUBxpGY/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "३१ जुलै २०२४ -\"मतदार यादीत नाव तपासणे का गरजेचे आहे\" बाबत माहिती ",
        link: "https://drive.google.com/file/d/1WOgb_GdVNZSrO3Sj65h_RHMPhVmFAc_Y/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - २८ जुलै २०२४ -मालमता करावरील १००% विलंब शास्ती माफ करणेकामी अभय योजनेस दि. ३१ जुलै २०२४ पर्यंत मुदतवाढ देण्यात आली आहे. ",
        link: "https://drive.google.com/file/d/15XSdna3iCBPXN0Hz1rxUP78U7tQ6kLDm/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - २६ जुलै २०२४ - मा. प्रशासक तथा आयुक्त डॉ. अजीज शेख यांच्या हस्ते दुर्गापाडा येथे नवीन हेल्थ पोस्टचे उद्घाटन करण्यात आले. ",
        link: "https://drive.google.com/file/d/1_kYUDDTW0gyiwc7gMoGhz02n7hYveaz8/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - २५ जुलै २०२४ -पावसाचे प्रमाण वाढल्यामुळे मा. प्रशासक तथा आयुक्त डॉ. अजीज शेख यांनी उल्हासनगर क्षेत्रातील परिसरात पाहणी केली. तसेच पावसामुळे शहरात कसलीही जीवित व वित्तहानी होऊ नये यासाठी महापालिका प्रशासन यंत्रणा नागरिकांच्या सेवेत सतर्क आहे. ",
        link: "https://drive.google.com/file/d/1b4m8B1VToVexwrUrkbsNJK0m1nC6Qpq4/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - २४ जुलै २०२४ -मा. प्रशासक तथा आयुक्त डॉ. अजीज शेख यांच्या निर्देशानुसार ,उपायुक्त डॉ. सुभाष जाधव यांनी काही नाल्यांची पाहणी केली. महानगरपालिकेची अग्निशमन यंत्रणा, आपात कालीन यंत्रणा, भांडार विभाग तसेच संबंधित यंत्रणा वेळोवेळी बचावाचे कार्य करीत आहे. ",
        link: "https://drive.google.com/file/d/1nKXr-TY2S_l1DJTEKxWQIICyPLd9Cabi/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - १८ जुलै २०२४ - \"हिंदुहृदयसम्राट बाळासाहेब ठाकरे आपला दवाखाना\" साईबाबा मंदिर , ओ .टी सेकशन उल्हासनगर-४ येथे सुरु करण्यात येत आहे. ",
        link: "https://drive.google.com/file/d/1MbTnsb--cNj48qe-nYoqH5yIKB__8Ged/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - १६ जुलै २०२४ - सॉलीनेस इंटेग्रीटी कंपनीच्या CSR फंडातून रु.५५ लक्ष किमतीच्या रोबोटिक मॅनहोल क्लिनिंग सोल्युशनचा उद्घाटन सोहळा दि. १६/०७/२०२४ रोजी करण्यात आला. ",
        link: "https://drive.google.com/file/d/1CR0bxDhmULjQ-FrOtvhL_xmANnqgzcOF/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - १५ जुलै २०२४ -उल्हासनगर महानगरपालिका कार्य क्षेत्रात वैद्यकीय आरोग्य विभागामार्फ़त १५ वित्त आयोग अंतर्गत \"आयुष्यमान आरोग्य मंदिर - नागरी आरोग्य वर्धिनी केंद्र \" उल्हासनगर-५ येथे सुरु करण्यात आले. ",
        link: "https://drive.google.com/file/d/1bLfukORVXCyLILwJvAlRgKT7E-6kUQje/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - १५ जुलै २०२४ - मा. प्रशासक तथा आयुक्त यांनी रस्त्यांवरील खड्डे बुजविणे व शहरातील इतर रस्त्यांबाबत बाबत विशेष बैठक घेऊन अधिकाऱ्यांना सूचना दिल्या. ",
        link: "https://drive.google.com/file/d/1Urxn8lWLBwHYc-gQLtN_lBLyJ2hKzYnM/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - १२ जुलै २०२४ - क्रीडा व युवक सेवा संचालनालय ,महाराष्ट्र राज्य व उल्हासनगर महानगरपालिका द्वारे आयोजित खेळाडू व क्रीडा शिक्षकांचे प्रशिक्षण शिबीर आणि कराटे/लाठी काठी स्पर्धा व प्रशिक्षणाचे मा. आयुक्त तथा प्रशासक डॉ. अजीज शेख यांच्या मार्गदर्शनाखाली आयोजन करण्यात आले होते. ",
        link: "https://drive.google.com/file/d/1I1dmObyvYgsmVWrJV5-0uhc7bwsKBsAL/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - १० जुलै २०२४ - उल्हासनगर महानगरपालिके तर्फे , प्रशासक तथा आयुक्त डॉ.अजीज शेख यांच्या मार्गदर्शनाखाली \"सुब्रतो फुटबॉल\" स्पर्धा २०२४-२५ चे आयोजन करण्यात आले . ",
        link: "https://drive.google.com/file/d/1NuHmFYvMg5cc5Z4awsmQJpcRRiZGa7Kd/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - १० जुलै २०२४ - उल्हासनगर महानगरपालिका केंद्र व राज्य पुरस्कृत समग्र शिक्षा विभाग यांच्या मार्फत (० ते १८) वयोगटातील दिव्यांग मुलामुलींचे सर्वेक्षण करणे बाबत. ",
        link: "https://drive.google.com/file/d/17zTNfpJnnJM23di_aTTUof8V1njJuuSm/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - ९ जुलै २०२४ - डॉ.अजीज शेख, प्रशासक तथा आयुक्त यांच्या मार्गदर्शनाखाली प्लास्टिक निर्मूलन पथक व प्रदूषण मंडळाचे अधिकारी यांनी प्लास्टिक उत्पादन कारखान्यावर धाड टाकून ३६५ किलो प्लास्टिक साठा जप्त केला व १०,००० रु. दंडात्मक कार्यवाही केली. ",
        link: "https://drive.google.com/file/d/1HEh7hp-S6cUhM_u6pYUU0cT4faEX_d0n/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - ९ जुलै २०२४ -उल्हासनगर महानगरपालिकेमध्ये सन २००५ नंतर रुजू झालेल्या कर्मचाऱयांना प्राण PRAN किट चे वाटप करण्यात आले व NPS बाबत प्रशिक्षण देण्यात आले. ",
        link: "https://drive.google.com/file/d/1Va4stWP2wxiW8mX-k9GJmj_EaU9x8oPb/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - ९ जुलै २०२४ -महापालिका प्रशासक तथा आयुक्त डॉ.अजीज शेख यांनी हवामान खात्याकडून रेड अलर्ट जारी केला असल्याने खबरदारी म्हणून महापालिका क्षेत्रातील मुख्य नाले व इतर ठिकाणाची पाहणी करून संबंधित अधिकारी व कर्मचारी यांना योग्य ते निर्देश दिले. ",
        link: "https://drive.google.com/file/d/1f8QJXaamPRP-4WSuJkgfE9mls76XwBAX/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - ८ जुलै २०२४ -पर्यावरण पूरक उत्सव साजरे करण्याबाबत योग्य ती अंमलबजावणी करण्याबाबत मा. प्रशासक तथा आयुक्त डॉ. अजीज शेख यांनी मूर्ती कारखानदार/मूर्तिकार/ मूर्ती विक्रेते यांना निर्देश दिले. ",
        link: "https://drive.google.com/file/d/1Vs0PrdoIbyru5Z-b7_UaNWY9pH1XiZFm/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - ८ जुलै २०२४ -\"मुख्यमंत्री माझी लाडकी बहीण\" योजना राबविणेसाठी मा. प्रशासक तथा आयुक्त यांचे मार्गदर्शनाखाली एकदिवसीय कार्यशाळा आयोजित करण्यात आली. ",
        link: "https://drive.google.com/file/d/1yj0rsCc2N62VYYqj_O1nvqN4KN7ZRwkK/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - ५ जुलै २०२४ - उल्हासनगर महानगरपालिका आणि शक्ती वेलफेअर फाऊंडेशन यांच्या वतीने वतीने थॅलेसिमिया ग्रस्त रुग्ण यांच्या समस्येवर आधारित सिंधी चित्रपट \"नई शुरुवात \" च्या स्क्रिनिंगचे ३० जून रोजी सकाळी महापालिका प्रशासक तथा आयुक्त डॉ. अजीज शेख , आमदार कुमार आयलानी, डॉ. सुभाष जाधव व इतर मान्यवर यांच्या उपस्थितीत महापालिकेचे सिंधू भवन, सपना गार्डन, उल्हासनगर-३ येथे उद्घाटन करण्यात आले असून सदर सिनेमाचा प्रथम शो या ठिकाणी संपन्न झाला. ",
        link: "https://drive.google.com/file/d/1fRc7KIiL3vzVhx1kodVRAekDaAQX1x5J/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - ३ जुलै २०२४ -म प्रधानमंत्री टी.बी मुक्त भारत अभियान अंतर्गत निक्षय मित्र नोंदणीबाबत. ",
        link: "https://drive.google.com/file/d/1GrrW58IhgxaQB_QBvUMJZ0vqYBDdl9o0/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - २ जुलै २०२४ -मा. आयुक्त तथा प्रशासक श्री.अजीज शेख यांच्या अध्यक्षतेखाली विविध दिव्यांग संघटनांची बैठक आयोजित करण्यात आली होती. ",
        link: "https://drive.google.com/file/d/1t6zmowdRIPQYM31BsP1QRRNPln5Uvvus/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - २८ जून २०२४ - उल्हासनगर महानगरपालिका क्षेत्रात विनापरवानगी अनधिकृत टपरीवर गुटखा, तंबाखू, सिगारेट विक्री करणाऱ्या विरुद्ध कारवाई. ",
        link: "https://drive.google.com/file/d/1UI79LDaMkururOT_P-djTm1d_eUbw1b2/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - २६ जून २०२४ - उल्हासनगर शहरातील अनधिकृत ऑर्केस्ट्रा बारवर कारवाई.",
        link: "https://drive.google.com/file/d/1b8q0WcOIFIWJAcRV8vDSigx_LOsPzkp-/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - २५ जून २०२४ - उल्हासनगर महानगरपालिका शाळेतील विद्यार्थ्यानचा शाळा प्रवेशोत्सव आणि शैक्षणिक साहित्य वितरण समारंभ मंगळवार दि. २५ जून २०२४ रोजी \"भारतरत्न डॉ. बाबासाहेब आंबेडकर अभ्यासिका\" येथे शिक्षण विभागामार्फत आयोजित करण्यात आला होता. ",
        link: "https://drive.google.com/file/d/1ePOat96-01pw-8X382y8sv_EXhnCWuhV/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - २४ जून २०२४ - माजी नगरसेवक श्री. प्रमोद टाले यांचे सुपुत्र श्री. अभिषेक टाले यांनी आय.ए.एस. होणेसाठी जी पुस्तके अभ्यासली ती पुस्तके \"भारतरत्न डॉ. बाबासाहेब आंबेडकर अभ्यासिकेत\" भेट म्हणून दिली. ",
        link: "https://drive.google.com/file/d/1CRaNOjDYwBbEmu-_zVW2hoa3Gp6lMYqL/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - १९ जून २०२४ -मा. महापालिका आयुक्त डॉ. अजीज शेख यांनी उप-आयुक्त(पा.पू व आरोग्य),सर्व प्रभाग अधिकारी, कार्यकारी अभियंता (सा.बां.वि), कार्यकारी अभियंता (पा.पू.वि), कार्यकारी अभियंता (विद्युत विभाग) यांची संयुक्त बैठक घेऊन सदर बैठकीमध्ये पावसाळ्यापूर्वी शहरातील विकासकामांबाबत आढावा घेऊन सदर कामे विहित वेळेत पूर्ण करणेबाबत निर्देश दिले. ",
        link: "https://drive.google.com/file/d/1wVr1EKrLyuBd3hwsjsMsS1HYSYTxySnK/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - १८ जून २०२४ -मा. महापालिका आयुक्त डॉ. अजीज शेख यांनी पावसाळ्यापूर्वी शहरातील मोठ्या नाल्यांची व रस्त्यांची प्रत्यक्ष पाहणी केली व आढावा घेतला. ",
        link: "https://drive.google.com/file/d/1v2X9-Vc7qon3uVgi2B9wCfwW5mvEeIUa/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - ३० मार्च २०२४ - उल्हासनगर महानगरपालिका वैद्यकीय आरोग्य विभाग अंतर्गत उत्कृष्ट काम करणाऱ्या आशा स्वयंसेविका यांचा सत्कार कार्यक्रमाचे आयोजन महापालिकेमार्फत करण्यात आले. ",
        link: "https://drive.google.com/file/d/1pdpu6AKGer8tFW0gzU50MhBwibz4JbHF/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - २३ मार्च २०२४ - जाहीर आवाहन - ष्ट्रीय क्षयरोग दुरीकरण कार्यक्रम अंतर्गत उल्हासनगर शहरात केंद्र शासनाच्या मार्गदर्शक तत्वावर सार्वजनिक आरोग्य विभागा तर्फे सन २००३ पासून राष्ट्रीय क्षयरोग दुरीकरण कार्यक्रम राबविण्यात येत आहे. ",
        link: "https://drive.google.com/file/d/1qwWH5qvan34__xOREnGiB1Ux67aQiWIE/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट०७ मार्च २०२४ - उल्हासनगर महानगरपालिकेच्या परिवहन उपक्रमासाठी एसी व नॉन-एसी बस करीता भाडेदर बाबत माहिती. ",
        link: "https://drive.google.com/file/d/1UL32tLmVcpAf_Wdug2ylq6yyyiZqxYyM/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट २७ फेब्रुवारी २०२४- उल्हासनगर महानगरपालिका महिला व बालकल्याण विभागामार्फत मेहनती विद्यार्थ्याना/मुलींना व पालकांना पारितोषिक देऊन सन्मानित करण्यात आले. ",
        link: "https://drive.google.com/file/d/1JfFjEsM4vnn2DadP1pA39Ui7xE-zOb5X/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट २७ फेब्रुवारी २०२४- उल्हासनगर महानगरपालिका महिला व बालकल्याण विभागामार्फत मेहनती विद्यार्थ्याना/मुलींना व पालकांना पारितोषिक देऊन सन्मानित करण्यात आले. ",
        link: "https://drive.google.com/file/d/13GTe9uYw_z2kuZFKy1MSFN8h0flKyOkw/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - मा.श्री.बालाजी किणीकर,आमदार, अंबरनाथ यांनी दि. २१/०२/२०२४ रोजी MMRDA मार्फत बनविण्यात येणाऱ्या उल्हासनगर शहरातील मुख्य ७ रस्त्यांचे बांधकामाबाबत श्री.अजीज शेख महापालिका प्रशासक तथा आयुक्त यांची भेट घेतली. ",
        link: "https://drive.google.com/file/d/1CmQjhNxNI3L7_qoEwie9V2zE19NvQ41B/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट -१५ फेब्रुवारी २०२४ रोजी स्व. आनंदजी दिघे आजी-आजोबा उद्यान, वीर जिजामाता चौक, मराठा सेकशन-३२, उल्हासनगर-४ येथे सायंकाळी ५:०० वाजताया गड किल्ले प्रदर्शनाचे उद्घाटन करण्यात आले. ",
        link: "https://drive.google.com/file/d/1WANwmUo8OjkThRnylJkRKyojBd31r-b4/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट -२ फेब्रुवारी २०२४- शिक्षण विभागामार्फत उल्हासनगर मनपा शाळांचा सांस्कृतिक कार्यक्रम व क्रिडा महोत्सव २०२३-२४टाऊन हॉल ,उल्हासनगर- ३ येथे साजरा करण्यात आला. ",
        link: "https://drive.google.com/file/d/1X8R2Zu_IAXCreplqBzWOxTDTv-qtZkNy/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - ११ जानेवारी २०२४ - कोरोना वार्तापत्र उल्हासनगर ",
        link: "https://drive.google.com/file/d/1q9F7399zEavcwLnU0qOgUVIk3xGv-uRy/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - ९ जानेवारी २०२४ -समग्र शिक्षा समावेशित शिक्षण उपक्रमा अंतर्गत कॅन्सर या आजाराबाबत जनजागृती ,दिव्यांग जनजागृती सकारात्मक व प्रेरणादायी व्याख्यान या विषयावर मार्गदर्शन करण्यात आले. ",
        link: "https://drive.google.com/file/d/1PK_7-xTpF7BuK7TrMtSezxYWRct56C4w/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - ९ जानेवारी २०२४ - कोरोना वार्तापत्र उल्हासनगर ",
        link: "https://drive.google.com/file/d/1TTJLNCh_4KMb95_aphl1hNDU2QR7AaKk/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - ४ जानेवारी २०२४ -महापालिकेच्या कार्यक्षेत्रातील रस्त्यावरील बेकायदेशील बेवारस वाहने यांच्याविरुद्ध कारवाही बाबत. ",
        link: "https://drive.google.com/file/d/15ipzR0RtxEMd4ZWCZVTsJvaydQfcAKbU/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "प्रेसनोट - ४ जानेवारी २०२४ -क्रांतीवीर सावित्रीबाई ज्योतिबा फुले जयंती उल्हासनगर महानगरपालीके मार्फत साजरी करण्यात आली. ",
        link: "https://drive.google.com/file/d/1yM4iYGzMCYaQahSgWZh61a7Ru9YJgvLo/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "५ डिसेंबर २०२३ - उप-राष्ट्रीय पल्स पोलिओ लसीकरण मोहीम बाबत मा.आयुक्त श्री. जमीर लेंगरेकर(अतिरिक्त कार्यभार) उल्हासनगर महानगरपालिका यांच्या अध्यक्षतेखाली बैठक आयोजित करण्यात आली. ",
        link: "https://drive.google.com/file/d/1_agunnJXvetqYdtq2_3o1YcbNBsg6Vv9/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "७ ऑक्टोबर २०२३ - राजीव गांधी प्रशासकीय गतिमानता (प्रगती) अभियान व स्पर्धा ",
        link: "https://drive.google.com/file/d/1TrjGdmIWRTHyAqfEqjjbKvDPpMlfyV13/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "५ ऑक्टोबर २०२३ - ४ ऑक्टोबर २०२३ रोजी प्रभाग अधिकारी यांनी मा. आयुक्त तथा प्रशासक यांना माती व तांदुळाने भरलेले अमृत कलश सुपूर्द केले. ",
        link: "https://drive.google.com/file/d/1CEY50d4Fn0ySg01sev5cSgCJx8m4MY2x/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "२२ सप्टेंबर २०२३ - इंडियन स्वच्छता लीग २.० अंतर्गत सफाई मित्र यांच्याकरिता सेवा व सुरक्षा शिबीर ",
        link: "https://drive.google.com/file/d/1w3MvvEgBaoL6REQxuLeNreymHoGLSCXv/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "१५ सप्टेंबर २०२३ - कोरोना वार्तापत्र उल्हासनगर ",
        link: "#",
        action: "View PDF"
    },
    {
        description: "१५ सप्टेंबर २०२३ - मा.आयुक्त तथा प्रशासक यांनी गणेश विसर्जन घाटांची व शहरातील रस्त्याची पाहणी करून सूचना दिल्या. ",
        link: "https://drive.google.com/file/d/1BqzP8ZfmGEGlK96uURRPndaqS6QMJLfe/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "१५ सप्टेंबर २०२३ - ११/०९/२०२३ रोजी मा.आयुक्त तथा प्रशासक यांच्या अध्यक्षतेखाली गणेशोत्सवाच्या पूर्वतयारीची आढावा बैठक घेण्यात आली.",
        link: "https://drive.google.com/file/d/1G_fr32WOBPpaTvuBTeTehR-09q6UZNtN/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "१३ सप्टेंबर २०२३ - उल्हासनगर महानगरपालिका कार्यक्षेत्रा अंतर्गत वैद्यकीय आरोग्य विभागामार्फत केंद्र शासनाचा अत्यंत महत्वाकांक्षी आयुष्मान भव मोहीम उद्घाटन सोहळा दि. १३/०९/२०२३ रोजी उल्हासनगर महापालिकेचे प्रशासक तथा आयुक्त श्री. अजीज शेख यांच्या हस्ते पार पाडण्यात आला. ",
        link: "https://drive.google.com/file/d/1eA_TvNaaaXCtlqPIOyE8ujjx8YR0ERK1/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "११ सप्टेंबर २०२३ - www.umcmv.in वर QR Code स्कॅन करून गणेश उत्सव पर्यावरणपूरक सजावट स्पर्धेकरिता नोंदणी करण्यात येईल. ",
        link: "https://drive.google.com/file/d/1HuzBCH_pXdWfQlnfoiOCqqKjXvGq2kK-/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "११ सप्टेंबर २०२३ - International Day Of Clean Air For Blue Skies निमित्त हवेतील प्रदूषण तक्रारींकरीता मोबाईल ऍप तयार करण्यात आले आहे. ",
        link: "https://drive.google.com/file/d/1rzxe_ExMuiEHR_F-B2-2MgsfWCxV0jSC/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "८ सप्टेंबर २०२३ - International Day Of Clean Air For Blue Skies निमित्त Quiz Competition घेण्यात आली व मा.आयुक्त यांच्या हस्ते प्रमाणपत्र देऊन गौरविण्यात आले. ",
        link: "https://drive.google.com/file/d/1Z-VBFbFuyXnUUoFkBoi33_dpD0xUoVtU/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "६ सप्टेंबर २०२३ - गणेश उत्सव सण जवळ येत असल्याने गणेशोत्सवा पूर्वी शहरातील रस्त्यांवरील खड्डे डांबरीकरणाने भरणेच्या कामास मा. आयुक्त यांनी सूचना दिल्या. ",
        link: "https://drive.google.com/file/d/19MZ_3wUwigEK0Rf8Qg3kmPXvsm0hbeHy/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "३१ ऑगस्ट २०२३ - उल्हासनगर शहरातील नागरिकांसाठी घरगुती गणेशोत्सव स्पर्धेचे आयोजन. ",
        link: "https://drive.google.com/file/d/1_xY9gU-pAHuI21osZx7I1wA-myRBr2-b/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "२९ ऑगस्ट २०२३ - \"पॉलिक्लिनिक\" व \"आपला दवाखाना\" उद्घाटन सोहळा दि.२८ ऑगस्ट २०२३ रोजी मा.आमदार श्री. कुमार आयलानी साहेब यांच्या शुभ हस्ते व मा. प्रशासक तथा आयुक्त श्री. अजीज शेख यांच्यास उपस्थितीत पार पाडण्यात आला. ",
        link: "https://drive.google.com/file/d/12HAcHoGrP42aYKpZG45gPeR5rAwzAdsr/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "२३ ऑगस्ट २०२३ - अधिनियम-३५ द्वारे उल्हासनगर शहरातील अनधिकृत बांधकामे नियमित करण्याबाबत २०२२(सुधारणा) अधिनियम मंजूर करण्यात आले आहे. शहरातील अनधिकृत बांधकाम असलेल्या मिळकत धारकांनी त्यांचे बांधकाम नियमित करण्याची संधी देणे बाबत. ",
        link: "https://drive.google.com/file/d/1unN-b-kXR99GNbhz_DZah3ZicYc35EgY/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "१६ ऑगस्ट २०२३ - शहिद अरुण कुमार वॆद्य सभागृह (टाऊन हॉल), उल्हासनगर -२ येथे उल्हासनगर महानगरपालिके मार्फत \"माझी माती माझा देश\" या कार्यक्रमा अंतर्गत स्वातंत्र्य सैनिक आणि वीरांचा सत्कार व सांस्कृतिक कार्यक्रम आयोजित करण्यात आले. ",
        link: "https://drive.google.com/file/d/1vP4EXmGsGC8uo6tKpLUqXo9nJrSbHX94/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "१५ ऑगस्ट २०२३ - भारतीय स्वातंत्र्याचा ७६ वा वर्धापन दिन समारंभ महापालिका आयुक्त मा. श्री. अजीज शेख यांच्या नियंत्रणाखाली उल्हासनगर महानगरपालिकेत मोठ्या जल्लोशात साजरा करण्यात आला. ",
        link: "https://drive.google.com/file/d/1iC9GMcN1-YvPSs1FrPf0B0cboXh87rLx/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "११ ऑगस्ट २०२३ - दिनांक १०/०८/२०२३ रोजी मा.आमदार महोदय श्री. कुमार आयलानी तसेच मा. आयुक्त श्री. अजीज शेख यांचे हस्ते ३ अमृत वाटीकांचे उद्घाटन करण्यात आले. ",
        link: "https://drive.google.com/file/d/1UTIUuQoRSl_rcvEAo0SOmIiT9-H3qhR4/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "९ ऑगस्ट २०२३ - स्वातंत्र्याच्या अमृत महोत्सवानिमित्त \"माझी माती माझा देश\" या अभियानांतर्गत पणती प्रज्वलित करुन \"पंचप्रण शपथ\" उल्हासनगर महानगरपालिका कार्यालयात मा. आयुक्त श्री. अजीज शेख साहेब यांच्या प्रमुख उपस्थितीत घेण्यात आली. ",
        link: "https://drive.google.com/file/d/1rjEpU0cSGA_qnNFZ4abMlUps5zI85i_j/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "९ ऑगस्ट २०२३ - उल्हासनगर महानगरपालिका शाळेच्या मुख्याध्यापक ,शिक्षक व विद्यार्थ्यानी \"माझी माती माझा देश \" उपक्रमात सहभागी होऊन पंचप्रण शपथ घेतली. ",
        link: "https://drive.google.com/file/d/1yH9sZy5TH1y4jZGzEPtyqMGnCRuu43HK/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: " ८ ऑगस्ट २०२३ - ८ ऑगस्ट २०२३ रोजी उल्हासनगर शहराच्या स्थापना दिनी \"माझी माती माझा देश \" या उपक्रमा बाबत माहिती देण्यात आली. ",
        link: "https://drive.google.com/file/d/1cfsIaFluZinwgNsNxr3hk7goc36o8wPm/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "२ ऑगस्ट २०२३ - उल्हासनगर महानगरपालिका स्तरीय \"विशेष मिशन इंद्रधनुष्य मोहिम ५.\" CTF बैठक दि. ०१/०८/२०२३ रोजी श्री.अजीज शेख , मा. प्रशासक तथा आयुक्त, उल्हासनगर महानगरपालिका यांच्या अध्यक्षतेखाली बैठक आयोजित करण्यात आली. ",
        link: "https://drive.google.com/file/d/175p8bdziutXhTG-V72qGWzxG51MZNYxa/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: " २ ऑगस्ट २०२३ - केंद्र शासनाच्या \"मेरी माटी मेरा देश\" या नवीन उपक्रमाची घोषणा . ",
        link: "https://drive.google.com/file/d/10yuYO7zhWvps9h_CKNMI3DSZWSaTOMf3/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "२७ जुलै २०२३ - दि. २६/७/२०२३ पासून पावसाचा हवामान खात्याने रेड अलर्ट घोषित केला असल्याने शहरामध्ये १३२ MM पावसाची नोंद झाली आहे. मा.आयुक्त तथा प्रशासक यांनी शहरातील नदी किनारी राहण्याऱ्या जनतेला सतर्क राहणेबाबत आवाहन केले आहे. ",
        link: "https://drive.google.com/file/d/1SBNMZs4NsHsnOzrrFhKiPLoVpkA0AVLX/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "२७ जुलै २०२३ - दि. २५ जुलै २०२३ रोजी मुंबई महानगर प्रदेश विकास प्राधिकरण तर्फे सुरु करण्यात आलेल्या ७ रास्त्यांच्या कामाबाबत मा. आयुक्त यांच्या अध्यक्षतेखाली बैठक आयोजित करण्यात आली. ",
        link: "https://drive.google.com/file/d/1yqlBAMy1MKCKw02t1OL4p3VW4h-qT94N/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "२६ जुलै २०२३ - सुब्रतो फुटबॉल कप २०२३ क्रीडा स्पर्धा ",
        link: "https://drive.google.com/file/d/1oNc2C9ZiNo4iEnqHuqf2S4l5nRgcb2fu/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "२६ जुलै २०२३ - उल्हासनगर होणार अधिक सुरक्षित CCTV चे असेल लक्ष... ",
        link: "https://drive.google.com/file/d/1xvNQ6oGw7xOeEyKOKDuxUjsXgWV2ppvA/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "२० जुलै २०२३ - उल्हासनगर महानगरपालिका हद्दीत नदीकाठी पूर सदृश्य परिस्थितीने बाधित ठिकाणी महानगरपालिकेची तात्काळ मदत, ९ लोकांचे जीव वाचवले. ",
        link: "https://drive.google.com/file/d/1BKhLuv4YPb6oSXBuHFjKUTa4C7hUIvvD/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "१८ जुलै २०२३ - शहरातील रस्त्यांवरील निर्माण झालेले खड्डे भरण्यासाठी मा.आयुक्त तथा प्रशासक श्री.अजीज शेख यांच्या उपस्थितीत दि. १८जुलै २०२३ रोजी व्हिडीओ कॉन्फरंसद्वारे बैठक घेऊन पूर्ण शहराचा आढावा घेण्यात आला. ",
        link: "https://drive.google.com/file/d/1Azws126RQtXVIYQbZNUZpBsYYq0Fs7AM/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "१८ जुलै २०२३ - मा.आयुक्त तथा प्रशासक श्री.अजीज शेख यांच्या अध्यक्षते खाली क्रीडा समितीची बैठक पार पाडण्यात आली असून स्पर्धा बाबत चर्चा करण्यात आली. ",
        link: "https://drive.google.com/file/d/18IB9qe1BZaspKH3jYM-Cmb4sUD6xgL1M/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "१२ जुलै २०२३- उल्हासनगर महानगरपालिकेच्या वतीने शाळा क्र. २९ येथे विद्यार्थ्यांसाठी दि. ११ जुलै २०२३ रोजी दंत चिकित्सा तपासणी शिबीर आयोजित करण्यात आले. ",
        link: "https://drive.google.com/file/d/1GDdXRcSa3bDGFeezSqp2nZKeqK6nfIJb/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "१२ जुलै २०२३- उल्हासनगर महानगरपालिकेच्या पाठपुराव्यामुळे , स्थानिक स्वराज्य संस्थाना पब्लिक सर्व्हिसेस (इतर) दरसूची विद्युत शुल्क माफ बाबतचा स्वतंत्र अद्यादेश दि. २७/०३/२०२३ रोजी महावितरण कंपनीने वितरीत केला. ",
        link: "https://drive.google.com/file/d/1QdLgrx7TSx18z5yEtnUPiB4xtRu0qyRJ/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "३ जुलै २०२३- उल्हासनगर महानगरपालिके मार्फत ज्येष्ठ नागरिकांकरिता \"इंदिरा गांधी उद्यान\" भाजी मार्केट ,उल्हासनगर-३ येथे विरंगुळा केंद्र सुरु करण्यात आले. ",
        link: "https://drive.google.com/file/d/1pD4Us_tl2QYAtCM5cuzOIfZidw5Cyo_e/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "३० जून २०२३- माननीय आयुक्त श्री.अजीज शेख साहेब यांनी उल्हासनगर महापालिका क्षेत्रात झालेल्या नालेसफाईची पाहणी केली व धोकादायक इमारतींबाबत सर्व प्रभाग अधिकारी यांना योग्य ती कार्यवाही करण्याबाबत सूचना देण्यात आल्या. ",
        link: "https://drive.google.com/file/d/1KQlOeWRWS6gNw0Q_HRnFMHBpUMSn51cI/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "२७ जून २०२३ - समग्र शिक्षा समावेशित शिक्षण व दिव्यांग कल्याणकारी योजना अंतर्गत मा.आयुक्त सो. तथा प्रशासक श्री. अजीज शेख साहेबांच्या मार्गदर्शनाने व प्रेरणेने उध्बोधन कार्यशाळा दि. २७ जून २०२३ रोजी उल्हासनगर महानगरपालिका येथे आयोजित करण्यात आली होती. ",
        link: "https://drive.google.com/file/d/1rqEjOwLy07uOlJXija6FsypS652RktLW/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "२६ जून २०२३ - नवभारत, नवराष्ट्र वृत्तपत्र समूहातर्फे आयोजित पर्यावरणविषयी उत्कृष्ट कामगिरी करीता उल्हासनगर महानगरपालिकेस पारितोषिक देऊन गौरविण्यात आले. ",
        link: "https://drive.google.com/file/d/1K2sN0GJNQXFC81hpZ3bjob00IrUULQQj/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "३१/०५/२०२३ -प्रथम सेवापूर्ती समारंभ .",
        link: "https://drive.google.com/file/d/119CbLqMicJUrjglStDKB9Vbi0X_Igrnh/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "१९/०५/२०२३(प्रेसनोट) - समग्र शिक्षण योजनेबाबत मा. आयुक्त तथा प्रशासक सो. यांचे मार्गदशनाने एक दिवसीय कार्यशाळेचे आयोजन. ",
        link: "https://drive.google.com/file/d/1o_RwdJwgsdKJ_6tDk6LeoZvtxqlUTziJ/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "१६/०५/२०२३(प्रेसनोट) - पावसाळ्यापूर्वी नाले सफाई कामकाजास सुरुवात करणेबाबत.",
        link: "https://drive.google.com/file/d/1AhJR2cL0yG8RegEYccOl9RXn54jBJrLR/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "१२/०५/२०२३ ( प्रेसनोट ) - मा. मंत्री (शालेय शिक्षण विभाग) यांच्या अध्यक्षतेखाली “समग्र शिक्षा व स्टार्स प्रकल्पाच्या प्रभावी अंमलबजावणी करिता\" क्षेत्रीय अधिकारी यांची 2 दिवसीय निवारी कार्यशाळा.",
        link: "https://drive.google.com/file/d/1fSAbs-jvNBjk8mN19qXORWft8YycKCrf/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "०८/०५/२०२३ रोजी पासून उल्हासनगर महानगरपालिका, महिला व बालकल्याण विभागामार्फत मोफत स्तनाचा कर्करोग (ब्रेस्ट कॅन्सर) आरोग्य तपासणी शिबीराचे आयोजन करण्या बाबत. ",
        link: "https://drive.google.com/file/d/11GW8Q2-6wEgxmpmkivtN7TRqGIbvWeK8/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "०८/०५/२०२३ रोजी पासून उल्हासनगर महानगरपालिका, महिला व बालकल्याण विभागामार्फत, मोफत तपासणी शिबीराचे आयोजन करण्याबाबत. ",
        link: "https://drive.google.com/file/d/1GuleRstjJWPWRrwCuU5p-ouqxwidNw6d/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "०८/०५/२०२३ (प्रेसनोट) - मा. खासदार डॉ. श्रीकांत शिंदे, लोकसभा सदस्य यांचे हस्ते रस्ते बांधकाम शुभारंभ . ",
        link: "https://drive.google.com/file/d/1Ml8_KZLb7vndFEyIDZMn_b-ZEjXpC-IR/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "०३/०५/२०२३ आपत्कालीन परिस्थतीत नागरिकांना तात्पुरत्या पुनर्वसन बाबत टाटा आमंत्रा भिवंडी येथे मा. आयुक्त सो यांची पाहणी. ",
        link: "https://drive.google.com/file/d/13RjhxAiY6yETYSbiWBoZ0IYd9QAL24hW/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "०१/०५/२०२३ रोजी महाराष्ट्र दिनाचे औचित्य साधून संपूर्ण महाराष्ट्रात \"हिंदूहृदयसम्राट बाळासाहेब ठाकरे आपला दवाखाना \" या योजनेचे मा.मुख्यमंत्री महोदय यांचे शुभहस्ते डिजिटल अनावरण करण्यात आले. ",
        link: "https://drive.google.com/file/d/1MJ73t0wQfDlbymO0fgsYWcekUehwh0OP/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "२५/०४/२०२३ - १७/०४/२०२३ रोजी राष्ट्रपती अग्निशमन शौर्य पुरस्कार सोहळा आयोजित करण्यात आल्या बाबत",
        link: "https://drive.google.com/file/d/1fgJSk90JQ-4SViZr7Brgqy0Oudqwphak/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: " २०/०४/२०२३ - १७/०४/२०२३ रोजी राष्ट्रपती अग्निशमन शौर्य पुरस्कार सोहळा आयोजित करण्यात आल्या बाबत",
        link: "https://drive.google.com/file/d/1_2RISDw-QAQMoy4R0Jw8wCP1W7KD7Tjs/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "१९/०४/२०२३ - उल्हासनगर शहरातील अनधिकृत बांधकाम नियमाधीन करणे अधिनियम २००६ मधील सुधारणांबाबत पारित अधिनियमाची माहिती सामान्य जनता, विकासक व वास्तुविशारद यांना व्हावी या अनुषंगाने महानगरपालिकेच्या जी.बी. सभागृहात मा.आयुक्त यांच्या अध्यक्षतेखाली बैठक घेतली. ",
        link: "https://drive.google.com/file/d/1u34EUyZ1eihirMKN1Et53DiR3qMYIwli/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "११/०४/२०२३ - केंद्र सरकारच्या केंद्रीय वने, पर्यावरण व वातावरणीय बदल मंत्रालयातर्फे राष्ट्रीय शुध्द हवा कार्यक्रम.",
        link: "https://drive.google.com/file/d/1GQmmb87i7PF54c2GN07oYHj8qvrjcGYS/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "१०/०४/२०२३ रोजी क्रीडा विभागामार्फत वर्ष २०२२-२३ मध्ये विविध खेळांमधे प्राविण्य मिळवलेल्या विद्यार्थ्यांना पारितोषिक वितरण करण्यात आले. ",
        link: "https://drive.google.com/file/d/1qUrwHQ2D3_H9AaTQ4gKpeV65LX3VQqpW/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "१०-०३-२०२३ - केंद्र शासनाच्या १५ वा वित्त आयोग अंतर्गत शहरातील हवेचे प्रदूषण कमी करणे बाबत. ",
        link: "https://drive.google.com/file/d/1SbjodZvAbtp1TSOFRa8ZoMSX7UjNOcRD/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "०२/०३/२०२३ धुलीवंदन (रंगपंचमी) या सणाचे पर्यावरणपुरक साजरीकरण होण्या करिता. ",
        link: "https://drive.google.com/file/d/1tUv7liCBUbDoYY7q1M8yPPABUZVHyD-F/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "२८/०२/२०२३ - उल्हासनगर महानगरपालिका कार्यक्षेत्रातील कोरोना वार्तापत्र - २८ फेब्रुवारी २०२3.",
        link: "https://drive.google.com/file/d/14lVn2NFitfKRWrCaT4NaElHDWcxzawCZ/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "१७/०२/२०२३ -- दिनांक १८ फेब्रुवारी, २०२३ रोजी महाशिवरात्री उत्सव बाबत. ",
        link: "https://drive.google.com/file/d/1DeMwmGpRBCL8UBaQ7elb76QJYRgIzmvq/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "०९/०२/२०२३ - उल्हासनगर महानगरपालिका कोविड लसीकरणाबाबत. ",
        link: "https://drive.google.com/file/d/1N4AOAwRvZPzR2cX-feRoQbiohXjac2zm/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "जागतिक सायकल दिनानिमित्त उल्हासनगर महानगरपालिका आयोजित महापालिका मुख्यालयापासून गोल मैदान व शहाड स्टेशन पासुन परत महापालिका मुख्यालय या मार्गावरून पर्यावरण जनजागृतीकरीता सायकल रॅली दि. ०३.०६.२०२२",
        link: "https://drive.google.com/file/d/1buLn7C2v9ePqN-eb2i5xzQMZ4nod1peM/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "उल्हासनगर महापालिका शिक्षण विभागामार्फत झुलेलाल हायस्कुल, उल्हासनगर- २ येथे महानगरपालिका शाळेच्या सर्व मुख्याध्यापक व शिक्षक यांचे एकदिवसीय शैक्षणिक कार्यशाळेचे आयोजन करण्यात आले",
        link: "https://drive.google.com/file/d/1MPUZhKZEpMVMGglz3EcouAb2ffj7O2WN/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "July 2015",
        link: "#",
        action: "View PDF"
    },
    {
        description: "April 2016",
        link: "https://drive.google.com/file/d/1ZklkxIYTek3214QJySQ9zAd-05kyHuvm/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "Oct 2016",
        link: "https://drive.google.com/file/d/1fu49xy1Owel4PFNw4q0qWaFgwumesi36/view?usp=drive_link",
        action: "View PDF"
    },
    {
        description: "Dec 2016",
        link: "https://drive.google.com/file/d/1J6auQ2N0Z2vwWl_y5zYkU-TlfYafBbru/view?usp=drive_link",
        action: "View PDF"
    },
];

const ITEMS_PER_PAGE = 20;

const PressNote = () => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(notes.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentData = notes.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
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
                <div className="container-fluid font-location mt-4 mb-2" id="press-css">
                    <nav className="breadcrumb">
                        <Link to="/" className="breadcrumb-item text-decoration-none">
                            Home
                        </Link>
                        <span className="breadcrumb-item active1">Press Note</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">Press</span>
                        <span className="highlighted-text"> Note</span>
                        <hr />
                    </h2>

                    <div className="row mt-4 row-styling-3">
                        <div className="col-12">
                            <div className="circular-wrapper">
                                <table className="table table-bordered table-responsive shadow">
                                    <thead className="bg-orange text-white">
                                        <tr>
                                            <th
                                                className="table-heading-styling"
                                                style={{ textAlign: "center" }}
                                            >
                                                Sr. No.
                                            </th>
                                            <th className="table-heading-styling">Description</th>
                                            <th
                                                className="table-heading-styling"
                                                style={{ textAlign: "center" }}
                                            >
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.map((item, index) => (
                                            <tr key={index}>
                                                <td
                                                    className="font-large"
                                                    width="6%"
                                                    style={{
                                                        paddingLeft: "10px",
                                                        paddingRight: "10px",
                                                        color: "#292D32",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    {startIndex + index + 1}
                                                </td>
                                                <td
                                                    width="80%"
                                                    style={{
                                                        paddingLeft: "10px",
                                                        paddingRight: "10px",
                                                        color: "#292D32",
                                                        textWrap: "pretty"
                                                    }}
                                                >
                                                    {item.description}
                                                </td>
                                                <td
                                                    width="10%"
                                                    style={{
                                                        paddingLeft: "10px",
                                                        paddingRight: "10px",
                                                        color: "#333333",
                                                        textAlign: "center",
                                                    }}
                                                >
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
                                                        {item.action}
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
                                    <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                                        Previous
                                    </button>
                                </li>
                                {renderPageNumbers()}
                                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                    <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
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

export default PressNote;

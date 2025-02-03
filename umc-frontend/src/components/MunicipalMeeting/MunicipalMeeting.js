// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import ".//MunicipalMeeting.css"
// import pdficon from '../../assets/images/Departments/document 1.png'
// import Swal from 'sweetalert2';

// const generalBodyData = [
//     { Year: 'General Body 2000', Pdf1: 'https://drive.google.com/file/d/15sF2bQkmtH5zjYPavVXhlibMYeJ6xUaA/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1_4rnX2XBgXXqz0PNkPGrdNuv4rKiyYVM/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1rJHwYG5tbX4YsKm42mCVtoDO7V36ubJN/view?usp=drive_link' },
//     { Year: 'General Body 2001', Pdf1: 'https://drive.google.com/file/d/1agiKWlCY4UDAUEjxkSpPw858f5rybzre/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1hQXRp912C-HZ5dnhnIoVx1EdaDaNaoSe/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1j697LDLH46OawG5uiZCWwEIpg-nAsJD0/view?usp=drive_link' },
//     { Year: 'General Body 2002', Pdf1: 'https://drive.google.com/file/d/1w03dZoHTUnQunhJyVMSV7qupd65snlrF/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1nD-8NiqyCpeT7shdxFqLhzQuWdQ9N4Mb/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1mBqgDwo1qeYH1EZHLLNhTZatW0fP_PT9/view?usp=drive_link' },
//     { Year: 'General Body 2003', Pdf1: 'https://drive.google.com/file/d/1E1TfGwObsvJdjKqKWlfngmYbqAUbYGcb/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1Kj7niaDFSC_nUCVKmPf6umC1PqcHXTrj/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1mDmCyKWvtiXSFzqq5rQAwfHK72nmFLJj/view?usp=drive_link' },
//     { Year: 'General Body 2004', Pdf1: 'https://drive.google.com/file/d/18jbyQC6ndqrcuCmJW1JXv1iGHjXIFusv/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1gmrOzORedGB8kf8KPkw0Hv5l5aUCmw52/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1-B333gb26UZXF_lcNmKhvi5LXIeUHamd/view?usp=drive_link' },
//     { Year: 'General Body 2005', Pdf1: 'https://drive.google.com/file/d/1By49OFEP8yNqVppXtvr3L3gRMrsi5BNn/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1jiS-8BPVS7N-Cv5H6KLoDLEXOuGuG3eO/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/19Z7hlX3B10_7WN2BkDXV09_QOzVirMb9/view?usp=drive_link' },
//     { Year: 'General Body 2006', Pdf1: 'https://drive.google.com/file/d/1BNI2A-9OjSpKC57pHN2HuDobFzy62snL/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1I_mpa6kAfmnhnZrhb8fxw1Q8_GSN05Fu/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/18-BOGL1t6n950xRai8d8KYl7EsDtDQNW/view?usp=drive_link' },
//     { Year: 'General Body 2007', Pdf1: 'https://drive.google.com/file/d/14nYuC6BfLIdkHUcv_yqXDzl4Ec3xaRLH/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1G3-hp5oVYYohrXAdjk5E747n8NXwRN9v/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/18jFjoZ6W-OGQ377u_Dx9wUYHSxDpOod7/view?usp=drive_link' },
//     { Year: 'General Body 2008', Pdf1: 'https://drive.google.com/file/d/1_JcVih9eQu_5oM2XFXUi_TtgUp-BN9b8/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1togQbQwALWZ76nEVAN8JSdvcoQvgTvkh/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/107evmb1hHWmrzks0RGJzaJ3ZwEnc3BQi/view?usp=drive_link' },
//     { Year: 'General Body 2009', Pdf1: 'https://drive.google.com/file/d/1dydXI6FvqFQ-PWyI-CJDnB13547WGQ1M/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1F-tbYfz-vvQpZsEUMGeKVCfZ_DHjeFoJ/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1l6EWUa7PfHum3OtnRkak1aA6gwJyEfpO/view?usp=drive_link' },
//     { Year: 'General Body 2010', Pdf1: 'https://drive.google.com/file/d/1nwwrxi7uPmXNbMT3sWcPAUsYq9DT8ssl/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/16Lu22jN0OJ_8pTcX5YWNW3vMyJ1sOevK/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/12dm99RClqSCG2LGyTX3-C-YZkV2QpeVH/view?usp=drive_link' },
//     { Year: 'General Body 2011', Pdf1: 'https://drive.google.com/file/d/1U8gnLMclrtScPGCxunWU2LUsUAJUEXGk/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1qFJdwf7rrguWGQ0dtVwDz5VAC2DbxwHx/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1iZartegozRFW2IITxj715_5PhuyLVfGX/view?usp=drive_link' },
//     { Year: 'General Body 2012', Pdf1: 'https://drive.google.com/file/d/1Xd-T4EwwN1nVhyuRCY5YFt3XkcM_IF5C/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1ipaL34E-OhRzdOdV4M7xsKu5o8RdLnC3/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/18JIHMeyr8dAYSc-Yv93Zh5bo2IY5WXQw/view?usp=drive_link' },
//     { Year: 'General Body 2013', Pdf1: 'https://drive.google.com/file/d/1-qwtGC_5YRibTdCmVwg_ItydGhMzhjyU/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1Rd6dy5oRrJZwprymblI0dMc_hChdvPvK/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1emH0Dh7XaDcD5ns8tk_oGh8kcbIxl_4m/view?usp=drive_link' },
//     { Year: 'General Body 2014', Pdf1: 'https://drive.google.com/file/d/1KHlvSaYS1b4RzuEYFNqQKmOBB1SIh9vY/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1JrzkdLR1VGSCueIHRXhsr4F4kdwItsgN/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1cb1QoljrU5kRzWbgIjnPoyy4C6IL_6-u/view?usp=drive_link' },
//     { Year: 'General Body 2015', Pdf1: 'https://drive.google.com/file/d/15ylMpGrHBiD0IlCcSNey9O2fp3UaeIE3/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1aaekm5xR-tDmfcHHgqrLQofHiRbySyOY/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1g2WdOCFv5liKQYnDaEOLRC1jkUY69uFH/view?usp=drive_link' },
//     { Year: 'General Body 2016', Pdf1: 'https://drive.google.com/file/d/1swdsEr32qz7B3ZhoItDgBSKpHj62MN6m/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1fSGxKksc26xaqtkLscS8y6aJ5RQ2MnQZ/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1OjUM2Fc4N4cNaFg5z-q6SgKSzlPf_Md3/view?usp=drive_link' },
//     { Year: 'General Body 2017', Pdf1: 'https://drive.google.com/file/d/1cr4dVo5Fmk_CIkfYPaozSew8pKVrrEgO/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1W7grad5cY9OyknK6yghaZZLdxwei016l/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1LioftmG-9arKyDJ6sqNprifwOfjRcK5o/view?usp=drive_link' },
//     { Year: 'General Body 2018', Pdf1: 'https://drive.google.com/file/d/1KVEYaeXfraQa-IxWCmqYHDk1yQfVyX1x/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1cTG8J2LgnsOGyw50zLm4p15mmdrZUfH_/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/14bp77-T3NT9rrEgEuka4Z5DC6gVENl2W/view?usp=drive_link' },
//     { Year: 'General Body 2019', Pdf1: 'https://drive.google.com/file/d/1gd0NFIha35RU5Ylw6ho8_XYKNKpyecE8/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1Jf_id2VULP0ZFLZGQfex75UBsAv_wSOo/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1seU34lRso6XU8J70hF8r-wkBQeDQElUo/view?usp=drive_link' },
//     { Year: 'General Body 2020', Pdf1: 'https://drive.google.com/file/d/1VYTkG5f-SsYSDV8yA6RVyIVlzIZjYlC_/view?usp=drive_link', Pdf2: '#', Pdf3: '#' },
//     { Year: 'General Body 2021', Pdf1: 'https://drive.google.com/file/d/1YzvPLHlysE5Sy8LxpVAnWJHzcb8_iTWq/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1EhnvZNDKMQEPhktLMJwZKMl9FF9om9Cl/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1l7OLQiLRSo7RmBUbzHt2btb4t7Sgn6Tk/view?usp=drive_link' },
//     { Year: 'General Body Nov-Dec 2017', Pdf1: '#', Pdf2: 'https://drive.google.com/file/d/1X7Smz86VVbsn0ZpwxxQmYYHgTQkv6HKe/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1c5xFRwzfmoTh-nFkMNbqyUJhla3vVxmv/view?usp=drive_link' },
//     { Year: 'General Body Resolution 2022', Pdf1: '#', Pdf2: '#', Pdf3: 'https://drive.google.com/file/d/1bMH7zUDxkRQmdG5AklnzVbyHYg8vaooq/view?usp=drive_link' },
// ];

// const specialGeneralBodyData = [
//     { Year: 'Special General Body 2005', Pdf1: 'https://drive.google.com/file/d/1HT7DLf2xGAuRmmW0fx8MCyPwrz17GFoG/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1eO7z6TaIfRIW3-H-ZXlkfZoPhvf4Xy6U/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1_0STVwSbsBRRqBa596IJWRM0rB0XAgP0/view?usp=drive_link' },
//     { Year: 'Special General Body 2006', Pdf1: 'https://drive.google.com/file/d/1WXVUGWCx72B3LGJtPIv1Lfggo9dhXlIU/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1IIr3YJKgvgjfz79OvFVBHsA1E-BH5tmB/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1200kh1GIhv4ERQmd3w1wDmNM3B6e1dP_/view?usp=drive_link' },
//     { Year: 'Special General Body 2007', Pdf1: 'https://drive.google.com/file/d/1MrrlxrXSGGOZLjSUbA2wc6sKQOEOE0wr/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/173-7Bqd4rgEdxBKvKv-tN_2PjDRqg_Pj/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/142_fXbjU1pzLL1XQzcHtNNMWVXehoEPB/view?usp=drive_link' },
//     { Year: 'Special General Body 2008', Pdf1: 'https://drive.google.com/file/d/1ungmSoml6H_mh2mpFJj-Q8Y1SvhKLsGM/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1gvY5FNpj5Neoii8TV-d3w1bvCpyX6AiE/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1-X8Wpdy1dmq0boAkZhI4WdETct8Kj0cF/view?usp=drive_link' },
//     { Year: 'Special General Body 2009', Pdf1: 'https://drive.google.com/file/d/1r65ZLWxV8qR0XWnkbF5wSonRt6j5a84N/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1XqAilAY8WzQBEx_K0BDJQPugJKqkB2xM/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1IL0pEWI-8zltEY_2Ujhrrlhc6DRXQVFV/view?usp=drive_link' },
//     { Year: 'Special General Body 2010', Pdf1: 'https://drive.google.com/file/d/1wV0-atjLwMme3K0doTsW_G9VP9qum4Rc/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1eFI2SQwndKNxg43qJCH24bmwEd8wIPxM/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/16LdTRFZl5S1iJMUxh9yZ45u-h1l-VAn5/view?usp=drive_link' },
//     { Year: 'Special General Body 2011', Pdf1: '#', Pdf2: '#', Pdf3: 'https://drive.google.com/file/d/1k-gV-zhy88YICIaivppuEbTWaBWkJEa8/view?usp=drive_link' },
//     { Year: 'Special General Body 2012', Pdf1: 'https://drive.google.com/file/d/1EmjghdYO1laLqrYiWE3WmqoyRU75b8zF/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1a6NL0mxkPGTXmIiKFAPZrx-fgJlwTyzF/view?usp=drive_link', Pdf3: '#' },
//     { Year: 'Special General Body 2013', Pdf1: 'https://drive.google.com/file/d/1B0iX3hnSCYqXSEXswLxRUpda59t26J62/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1gN8-HgkW9LWfqlc-wwEDoMc616QdjxLb/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1QS6QabUq7l1KFm_dMI_c90wAHNc4kB7r/view?usp=drive_link' },
//     { Year: 'Special General Body 2014', Pdf1: 'https://drive.google.com/file/d/1cPSuVT3H6f4Ns_Mt-E4Qvnb5HP-dtjQe/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1cRsS9YzvYiCmd8kFST2W3-JXQwpLFib4/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1IFOowNqCcGwVdGaAnXWtnzoNsFIFLbCo/view?usp=drive_link' },
//     { Year: 'Special General Body 2015', Pdf1: 'https://drive.google.com/file/d/1vHglsoUlmTqXiUgspdDpfGlSf_S_-ixV/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1qe_4Kbn_UGJPyotNXIYDb8LFTdOpo43K/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1VcqK5EBMO3h-r3VVJq3WcFw2irRdnBW1/view?usp=drive_link' },
//     { Year: 'Special General Body 2016', Pdf1: 'https://drive.google.com/file/d/1CpghR_x9HxwMApegItFwiyxFkUra3cNU/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1eeN94NKU9BI6pfXCvfQzhvGMq2pJ9Ogd/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1f3yuLHmNd4s9rH6CKcORFM1Bu1jQs8zJ/view?usp=drive_link' },
//     { Year: 'Special General Body 2017', Pdf1: 'https://drive.google.com/file/d/1yUmQqdhBckqqCUdb1_r1KhUYwOvYlXS8/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1Ztnhx2SDVEPMYuRJiH8FFaQWzLKmCd7L/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1GBOy874wcV4SYyaDt1iieNHn52zgpHbM/view?usp=drive_link' },
//     { Year: 'Special General Body 2018', Pdf1: 'https://drive.google.com/file/d/1m1JLVTSkP-hFfQ_X4dp8MVllEB2y_hoX/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1KUuXnONChUjHX4nBSKcXz6Sd9mdz7XiW/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1BA6F7NLCfSrvQYZtFpxKLxmI-anMsD1Z/view?usp=drive_link' },
//     { Year: 'Special General Body 2019', Pdf1: 'https://drive.google.com/file/d/1DojRRiUQIpLmrXPeLWLwao7t42IywynV/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/198fnzRGycS3UmfwPzfK4FuFT16SDdqFM/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1c_H6IewmNt9Q7fNGGMhpjOwSbRqPpmcB/view?usp=drive_link' },
//     { Year: 'Special General Body Nov-Dec 2017', Pdf1: 'https://drive.google.com/file/d/1dXVgX9C98EfLXKXdC78kJPpNH527qWzb/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1P8Ac0dfB5Zmde1VBM4RZ5n9ejQpaMgR3/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1prZn2HJxw6o2MNSLm1lh1jjd7cuj5-YA/view?usp=drive_link' },
// ];

// const standingCommitteeData = [
//     { Year: 'Standing Committee Agenda 2000', Pdf1: 'https://drive.google.com/file/d/1mQpMIX15jC82_-tWbx9LIJEWyhW7ycG_/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1htqWDEVM0pc-P2vUTk5TVUyKaeqvFHOB/view?usp=drive_link', Pdf3: '#' },
//     { Year: 'Standing Committee Agenda 2001', Pdf1: '#', Pdf2: 'https://drive.google.com/file/d/1MBdWwCSq8DloyA7aRWQFvb33UqcyolFF/view?usp=drive_link', Pdf3: '#' },
//     { Year: 'Standing Committee Agenda 2002', Pdf1: 'https://drive.google.com/file/d/1zRaij5o7QnSil_kcc5LfNE4LYko3AMy0/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1sIFoaCmGVDNpk5KtME3djCUyZtahbmbt/view?usp=drive_link', Pdf3: '#' },
//     { Year: 'Standing Committee Agenda 2003', Pdf1: 'https://drive.google.com/file/d/1ituNZ44kbpW1ZmRejpGpFlWIMKpURgtX/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1ZNSASgcWBWt-_cHlNBGGaiN2Npvlu5_6/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1W8k6rf0hBpQBIZ7_u7h7YR_38egEndud/view?usp=drive_link' },
//     { Year: 'Standing Committee Agenda 2004', Pdf1: 'https://drive.google.com/file/d/1j877TKXoQ5PnGLq2tbt14G7R0nFQy8Dx/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1uAofxg6uwaTzpuvuJS34qDez9SDfwxlH/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1DO_L7I76-ZOEqZauRmnwv2R5vXjpQ3DA/view?usp=drive_link' },
//     { Year: 'Standing Committee Agenda 2005', Pdf1: 'https://drive.google.com/file/d/1qck_6_EXQ_FIqr0r0oiA5-BO15UFZh2b/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/11aobf5-DTRR6tDtGoi-ytIob4PQmGq9_/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1qCuIj4xBcLvrVMLD-2-vPMaGPunyniBt/view?usp=drive_link' },
//     { Year: 'Standing Committee Agenda 2006', Pdf1: 'https://drive.google.com/file/d/18sN-ADbtWTjg4j4kL8HZbWnnG7ohRQBd/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1XKWFLwlMQEdncNgYKpyWRiw35RNwrPN9/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1UVBChk8HeGFOM_mSIuwLDrFZzCt2f2yW/view?usp=drive_link' },
//     { Year: 'Standing Committee Agenda 2007', Pdf1: 'https://drive.google.com/file/d/1TVUczXEjY5W63HiNJ8TYbb6km9FoMngo/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1bCKMZ2HXAtp0PPPP-wMurZE40Yq3jhDm/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1Bnuq3UnplfzvLGx-x97R8i4us8HvXL_c/view?usp=drive_link' },
//     { Year: 'Standing Committee Agenda 2008', Pdf1: 'https://drive.google.com/file/d/1kc4UbYPYEH5tRe96t7MoIEUq2-sR49T-/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1RwAAJKZ92U2PpzWMmvFTgEQWeqQadg43/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1_5GmmCvvqp-My9HzXCmmpoWGU4TcaLA0/view?usp=drive_link' },
//     { Year: 'Standing Committee Agenda 2009', Pdf1: 'https://drive.google.com/file/d/103IIQlPokj0vXDuEbkHMkHGN8981zb6g/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/12mx3ZaKtKIYAV6ZTB2vr94fAWB8KnpDH/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1DC3P6nFjed2r3O_QkkeLc75iAh_j--16/view?usp=drive_link' },
//     { Year: 'Standing Committee Agenda 2010', Pdf1: 'https://drive.google.com/file/d/1G3txmxlyElJOtyGu6kLY8FFA6uQZBzAg/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1XEyML7Ioif9jn_8hyusm8TqVODcITGu1/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1y-hB1qhTshBWoD5iaOsGmgAjFiGwsyoV/view?usp=drive_link' },
//     { Year: 'Standing Committee Agenda 2011', Pdf1: 'https://drive.google.com/file/d/1tALIabs3pQFkSQyQ6aBOAirYBLsLfNKb/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1sD2imB1kNgv7GCoKpwFPq9quhhbxDqsE/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/13kt2zy8HNrAjzW2_yDD4aNVxmEbYKJ4L/view?usp=drive_link' },
//     { Year: 'Standing Committee Agenda 2012', Pdf1: '#', Pdf2: 'https://drive.google.com/file/d/1tq69HM62kSjNRR5RwfMrzkOHfPP97yy9/view?usp=drive_link', Pdf3: '#' },
//     { Year: 'Standing Committee Agenda 2013', Pdf1: 'https://drive.google.com/file/d/11B4QJ-_r0sWmgNzAYICuswLpoFpaoH_e/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1cLvFL9jUKJpZVK5ZPu-u-wO3UIK7qLvH/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1p8tpK1BJuR4aisYeTs8y_PsDg1oQP6ix/view?usp=drive_link' },
//     { Year: 'Standing Committee Agenda 2014', Pdf1: 'https://drive.google.com/file/d/1ebCPPyOBO2VHMH5vb_pg5-qVjQvk0u6T/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/13Idrz2O3XEv_Wu4bW7Fqi2CtrRyx5-Ev/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1NCX1rR1eRXAjB3o3Gki_cs6KGcXEizIr/view?usp=drive_link' },
//     { Year: 'Standing Committee Agenda 2015', Pdf1: 'https://drive.google.com/file/d/1IbveDAyDdbAkgHbQyytlg9mP9Vh6o8oN/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1hO59WGa9U_mncvb6PQpMrpk_3UeTnaDk/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1T7Z0rNYMnsqq0A8zyHOf1x5Ej1DBbr_m/view?usp=drive_link' },
//     { Year: 'Standing Committee Agenda 2016', Pdf1: 'https://drive.google.com/file/d/1wncCBrpDYEmCSxlZe1KsRL3PFZD6lrr_/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1f6twOKaEt2FIzbEVvcbzeaLLnQwPvmh8/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/10wiHTEGvPJGDBcQG333yJJPr1wTZ6H9S/view?usp=drive_link' },
//     { Year: 'Standing Committee Agenda 2017', Pdf1: 'https://drive.google.com/file/d/1NCAzoJTdYD7Zdg6dXiy48MC-ldh1LsTx/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1uPAM5CPdgJqscKMOeYbvu9OROq5Z0cS2/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1lXfs-ZFmr_4eHQifBHBWYBz0HJJ-wIpV/view?usp=drive_link' },
//     { Year: 'Standing Committee Agenda 2018', Pdf1: 'https://drive.google.com/file/d/19E3LaLK2RFIGRALB9yF-Fv80UWJ2sYFf/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1zrP2ivITfeeWWYYZnarqdDYqmHuI2wrS/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1Ta0NOPY--o4Gi5dZGYN67K0m0xWqg5M8/view?usp=drive_link' },
//     { Year: 'Standing Committee Agenda 2020', Pdf1: 'https://drive.google.com/file/d/1rKAucJXX5Na16zb-afuTqrVpWgDBmAcy/view?usp=drive_link', Pdf2: '#', Pdf3: '#' },
//     { Year: 'Standing Committee Agenda 2021', Pdf1: 'https://drive.google.com/file/d/1q3pMHvOR1CoGSl6su-LDGsbGPZ5_ZF1C/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1IZsBF9WQ_b5RD91jAQOx2xtd5aW41ZPU/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1EXNL6fuv3SzBsuxWcJG0YRZ_W9TqHLPx/view?usp=drive_link' },
//     { Year: 'Standing Committee Agenda 2022', Pdf1: '#', Pdf2: '#', Pdf3: 'https://drive.google.com/file/d/1lQJ8QJYmWC8_3sv_aH2WMapGgj7xK7-0/view?usp=drive_link' },
//     { Year: 'Standing Committee Agenda Nov-Dec 2017', Pdf1: 'https://drive.google.com/file/d/1y-XRiIZirjFN8HBbdND5MJa_Q_p3pDSe/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1Cb5WNwwdEd7Puux5h6InoAMu9CL7mLEu/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1b6PCjLl8JQRGr0tWm_M3Qw-vvnkTG-ZO/view?usp=drive_link' },
// ];

// const treeCommitteeData = [
//     { Year: 'TC Agenda 2005', Pdf1: '#', Pdf2: '#', Pdf3: '#' },
//     { Year: 'TC Minutes 2006', Pdf1: '#', Pdf2: '#', Pdf3: '#' },
//     { Year: 'TC Minutes 2007', Pdf1: '#', Pdf2: '#', Pdf3: '#' },
//     { Year: 'TC Minutes 2008', Pdf1: '#', Pdf2: '#', Pdf3: '#' },
//     { Year: 'TC Minutes 2009', Pdf1: '#', Pdf2: '#', Pdf3: '#' },
//     { Year: 'TC Minutes 2010', Pdf1: '#', Pdf2: '#', Pdf3: '#' },
//     { Year: 'TC Minutes 2011', Pdf1: '#', Pdf2: '#', Pdf3: '#' },
//     { Year: 'TC Minutes 2012', Pdf1: '#', Pdf2: '#', Pdf3: '#' },
//     { Year: 'TC Minutes 2013', Pdf1: '#', Pdf2: '#', Pdf3: '#' },
//     { Year: 'TC Minutes 2014', Pdf1: '#', Pdf2: '#', Pdf3: '#' },
//     { Year: 'TC Minutes 2015', Pdf1: '#', Pdf2: '#', Pdf3: '#' },
//     { Year: 'TC Minutes 2016', Pdf1: '#', Pdf2: '#', Pdf3: '#' },
//     { Year: 'TC Minutes 2017', Pdf1: '#', Pdf2: '#', Pdf3: '#' },
//     { Year: 'TC Minutes 2018', Pdf1: '#', Pdf2: '#', Pdf3: '#' },
//     { Year: 'TC Minutes 2019', Pdf1: '#', Pdf2: '#', Pdf3: '#' },
// ];

// const transportCommitteeData = [
//     { Year: 'TRC Agenda 2010', Pdf1: 'https://drive.google.com/file/d/1xb6axoPBk0Rw6Z-ae8RBvvoHvwd8nyZe/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/11N2vB94wE-FlGr-1pIatlLfChLsGp-pj/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1TNsD_Q4oKbzssue5iVa25cCMFWcOe_XU/view?usp=drive_link' },
//     { Year: 'TRC Agenda 2011', Pdf1: 'https://drive.google.com/file/d/19sxygYPwz7i43shl69YUiggMQnqkohdl/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1JguXn5sgUyx4A4pgXv0S6KeU3IPbHFv4/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1cvO-VIk6OJKQ7y4EA24Wca-SlAL30ATC/view?usp=drive_link' },
//     { Year: 'TRC Agenda 2012', Pdf1: '#', Pdf2: 'https://drive.google.com/file/d/1a3KJ8V09g3zlRk24XPrM-e577ThGa62Q/view?usp=drive_link', Pdf3: '#' },
//     { Year: 'TRC Agenda 2013', Pdf1: 'https://drive.google.com/file/d/1gy2wpGTfo7HoijlOuI9om-3NiSjkDWPf/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1DPYpfHSpW59iuYvUaukoFx9-DvvWxFki/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1Y-KwA_fbeNhjYs2FMEa68akkuazqhzq_/view?usp=drive_link' },
//     { Year: 'TRC Agenda 2014', Pdf1: 'https://drive.google.com/file/d/1L-ECT_G3exKQNGZ7tw4JUaLe-voP0U8O/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1gQ98uTpkvsfGomEDnuerrQsjw93XylIq/view?usp=drive_link', Pdf3: '#' },
//     { Year: 'TRC Agenda 2015', Pdf1: 'https://drive.google.com/file/d/1wNLZFsdHGdM_fOz0OcBoQyTj6JepDidt/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1XaxTp7TJqiR2sa5YR2osae7E0xHrpbk7/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1jgLzBcyg64_POkioDe_qDL8fv2zGHoXA/view?usp=drive_link' },
//     { Year: 'TRC Agenda 2016', Pdf1: 'https://drive.google.com/file/d/1GckVwCNVfQR99IAkuYWg-7xNRODUGJf6/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1uBpjTd11a700ZjbRq9koYlEKat-J9xzv/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/17hK6Zna2j7ZMg1H9Zl614CpOs9Dx8YHs/view?usp=drive_link' },
//     { Year: 'TRC Agenda 2017', Pdf1: 'https://drive.google.com/file/d/1uN17LMssYoIdSqGjGeroIMwvF5WBDQe7/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1b80j0Zm9i3Fy5HsnAPZHifO6bVGfk5vw/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1mDApdh31-nTA54fdSlrcFrS_o9hL0Thd/view?usp=drive_link' },
//     { Year: 'TRC Agenda 2018', Pdf1: '#', Pdf2: '#', Pdf3: '#' },
//     { Year: 'TRC Agenda 2019', Pdf1: '#', Pdf2: '#', Pdf3: '#' },
//     { Year: 'TRC Minutes 2009', Pdf1: 'https://drive.google.com/file/d/1Gb6yXyWUA_9MmyTD4U5K-VcLQHKjFs3S/view?usp=drive_link', Pdf2: 'https://drive.google.com/file/d/1dFVprNtOWvT4oV8h57O_zcWI1jb20AKt/view?usp=drive_link', Pdf3: 'https://drive.google.com/file/d/1U8SX8ce69q3VwzjSnCZ_8xDk4FRbRMQH/view?usp=drive_link' },
// ];

// const MunicipalMeeting = () => {
//     const [selectedButton, setSelectedButton] = useState('General Body');

//     const headersMap = {
//         "General Body": ["General Body Agenda", "General Body Minutes", "General Body Resolution"],
//         "Special General Body": ["Special General Body Agenda", "Special General Body Minutes", "Special General Body Resolution"],
//         "Standing Committee": ["Standing Committee Agenda", "Standing Committee Minutes", "Standing Committee Resolution"],
//         "Tree Committee": ["Tree Committee Agenda", "Tree Committee Minutes", "Tree Committee Resolution"],
//         "Transport Committee": ["Transport Committee Agenda", "Transport Committee Minutes", "Transport Committee Resolution"],
//     };
//     const tableHeaders = headersMap[selectedButton] || [];

//     const handleClick = (link, e) => {
//         if (link === "#") {
//             e.preventDefault();
//             Swal.fire({
//                 title: 'Information',
//                 text: 'The PDF will be available soon.',
//                 icon: 'info',
//                 confirmButtonText: 'Ok'
//             });
//         }
//     };

//     const getTableData = () => {
//         switch (selectedButton) {
//             case 'General Body':
//                 return generalBodyData;
//             case 'Special General Body':
//                 return specialGeneralBodyData;
//             case 'Standing Committee':
//                 return standingCommitteeData;
//             case 'Tree Committee':
//                 return treeCommitteeData;
//             case 'Transport Committee':
//                 return transportCommitteeData;
//             default:
//                 return [];
//         }
//     };

//     const handleButtonClick = (buttonName) => {
//         setSelectedButton(buttonName);
//     };

//     const tableData = getTableData();
//     const [itemsPerPage, setItemsPerPage] = useState(10);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [searchTerm, setSearchTerm] = useState("");

//     const totalEntries = tableData.length;

//     const filteredData = tableData.filter((item) =>
//         item.Year.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const totalPages = Math.ceil(filteredData.length / itemsPerPage);
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

//     const handlePageChange = (pageNumber) => {
//         if (pageNumber >= 1 && pageNumber <= totalPages) {
//             setCurrentPage(pageNumber);
//         }
//     };

//     const handleItemsPerPageChange = (e) => {
//         setItemsPerPage(parseInt(e.target.value));
//         setCurrentPage(1);
//     };

//     const renderPageNumbers = () => {
//         const pageNumbers = [];
//         for (let i = 1; i <= totalPages; i++) {
//             if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
//                 pageNumbers.push(
//                     <li
//                         key={i}
//                         className={`page-item ${currentPage === i ? "active" : ""}`}
//                         onClick={() => handlePageChange(i)}
//                     >
//                         <button className="page-link">{String(i).padStart(2, "0")}</button>
//                     </li>
//                 );
//             } else if (
//                 pageNumbers[pageNumbers.length - 1]?.key !== "ellipsis" &&
//                 (i < currentPage - 1 || i > currentPage + 1)
//             ) {
//                 pageNumbers.push(
//                     <li key="ellipsis" className="page-item ellipsis">
//                         <span className="page-link">...</span>
//                     </li>
//                 );
//             }
//         }
//         return pageNumbers;
//     };

//     const updatedtotalEntries = tableData.length;
//     const startEntry = (currentPage - 1) * itemsPerPage + 1;
//     const endEntry = Math.min(currentPage * itemsPerPage, updatedtotalEntries);

//     useEffect(() => {
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//     }, []);

//     return (
//         <>
//             <div className="history-header-image"></div>

//             <div id="main-content">
//                 <div className="container-fluid font-location mt-4 mb-5" id="accounts-css">
//                     <nav className="breadcrumb">
//                         <Link to="/" className="breadcrumb-item text-decoration-none">
//                             Home
//                         </Link>
//                         <Link to="#" className="breadcrumb-item text-decoration-none">
//                             Corporation
//                         </Link>
//                         <span className="breadcrumb-item active1">Municipal Meeting</span>
//                     </nav>
//                     <h2 className="location-title">
//                         <span className="highlight">Municipal</span>
//                         <span className="highlighted-text"> Meeting</span>
//                         <hr />
//                     </h2>

//                     <div className="row mt-4 row-styling-3" id='municipal-css'>
//                         <div className="col-xl-9 col-lg-12 col-md-12 col-sm-12 col-12 ">
//                             <div className="button-group mb-4 d-flex justify-content-start">
//                                 <button className={`btn ${selectedButton === 'General Body' ? "active" : ""}`} onClick={() => handleButtonClick('General Body')}>General Body</button>
//                                 <button className={`btn ${selectedButton === 'Special General Body' ? "active" : ""}`} onClick={() => handleButtonClick('Special General Body')}>Special General Body</button>
//                                 <button className={`btn ${selectedButton === 'Standing Committee' ? "active" : ""}`} onClick={() => handleButtonClick('Standing Committee')}>Standing Committee</button>
//                                 <button className={`btn ${selectedButton === 'Tree Committee' ? "active" : ""}`} onClick={() => handleButtonClick('Tree Committee')}>Tree Committee</button>
//                                 <button className={`btn ${selectedButton === 'Transport Committee' ? "active" : ""}`} onClick={() => handleButtonClick('Transport Committee')}>Transport Committee</button>
//                             </div>

//                             <div className="d-flex justify-content-between align-items-center mb-3">
//                                 <div className="entries-wrapper">
//                                     <label htmlFor="entries" className="entries-label">
//                                         Show
//                                     </label>
//                                     <select
//                                         id="entries"
//                                         className="entries-select"
//                                         value={itemsPerPage}
//                                         onChange={handleItemsPerPageChange}
//                                     >
//                                         <option value="10">10</option>
//                                         <option value="25">25</option>
//                                         <option value="50">50</option>
//                                         <option value="100">100</option>
//                                     </select>
//                                     <span className="entries-text">entries</span>
//                                 </div>

//                                 <div className="input-group d-flex align-items-center" style={{ width: "270px" }}>
//                                     <label
//                                         htmlFor="searchInput"
//                                         className="search-label"
//                                         style={{
//                                             whiteSpace: "nowrap",
//                                         }}
//                                     >
//                                         Search
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="searchInput"
//                                         className="form-control serching-shorting"
//                                         placeholder="Search"
//                                         value={searchTerm}
//                                         onChange={(e) => setSearchTerm(e.target.value)}
//                                     />
//                                 </div>

//                             </div>
//                             <div className="circular-wrapper">
//                                 <table className="table table-bordered shadow table-responsive">
//                                     <thead className="bg-orange text-white">

//                                         <tr>
//                                             <th className="table-heading-styling text-center" width="8%">Sr. No.</th>
//                                             <th className="table-heading-styling" width="50%">Year</th>
//                                             {tableHeaders.map((header, index) => {
//                                                 // Conditionally render headers based on dataset
//                                                 if (header === "General Body Agenda" || header === "General Body Minutes" || header === "General Body Resolution") {
//                                                     return (
//                                                         <th className="table-heading-styling text-center" key={index}>
//                                                             {header}
//                                                         </th>
//                                                     );
//                                                 }
//                                                 return (
//                                                     <th className="table-heading-styling text-center" key={index}>
//                                                         {header}
//                                                     </th>
//                                                 );
//                                             })}
//                                         </tr>


//                                     </thead>
//                                     <tbody>
//                                         {currentData.map((item, index) => (
//                                             <tr key={index}>
//                                                 <td className="font-large text-center">
//                                                     {startIndex + index + 1}
//                                                 </td>
//                                                 <td>{item.Year}</td>
//                                                 <td className="text-center">
//                                                     <Link
//                                                         to={item.Pdf1}
//                                                         className="text-decoration-none"
//                                                         target={item.Pdf1 === "#" ? "" : "_blank"}
//                                                         style={{ color: "#333333" }}
//                                                         onClick={(e) => handleClick(item.Pdf1, e)}
//                                                     >
//                                                         <img
//                                                             src={pdficon}
//                                                             alt="PDF Icon"
//                                                             style={{
//                                                                 width: "18px",
//                                                                 height: "18px",
//                                                                 marginRight: "8px",
//                                                                 verticalAlign: "middle",
//                                                             }}
//                                                         />
//                                                     </Link>
//                                                 </td>
//                                                 <td className="text-center">
//                                                     <Link
//                                                         to={item.Pdf2}
//                                                         className="text-decoration-none"
//                                                         target={item.Pdf2 === "#" ? "" : "_blank"}
//                                                         style={{ color: "#333333" }}
//                                                         onClick={(e) => handleClick(item.Pdf2, e)}
//                                                     >
//                                                         <img
//                                                             src={pdficon}
//                                                             alt="PDF Icon"
//                                                             style={{
//                                                                 width: "18px",
//                                                                 height: "18px",
//                                                                 marginRight: "8px",
//                                                                 verticalAlign: "middle",
//                                                             }}
//                                                         />
//                                                     </Link>
//                                                 </td>
//                                                 <td className="text-center">
//                                                     <Link
//                                                         to={item.Pdf3}
//                                                         className="text-decoration-none"
//                                                         target={item.Pdf3 === "#" ? "" : "_blank"}
//                                                         style={{ color: "#333333" }}
//                                                         onClick={(e) => handleClick(item.Pdf3, e)}
//                                                     >
//                                                         <img
//                                                             src={pdficon}
//                                                             alt="PDF Icon"
//                                                             style={{
//                                                                 width: "18px",
//                                                                 height: "18px",
//                                                                 marginRight: "8px",
//                                                                 verticalAlign: "middle",
//                                                             }}
//                                                         />
//                                                     </Link>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                             <div class="last-updated-container">
//                                 <p className="last-updated-text">
//                                     <b>Showing {startEntry} to {endEntry} of {totalEntries} entries</b>
//                                 </p>
//                             </div>
//                         </div>

//                         <nav aria-label="Page navigation" className="d-flex justify-content-start">
//                             <ul className="pagination custom-pagination">
//                                 <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
//                                     <button
//                                         className="page-link"
//                                         onClick={() => handlePageChange(currentPage - 1)}
//                                     >
//                                         Previous
//                                     </button>
//                                 </li>
//                                 {renderPageNumbers()}
//                                 <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
//                                     <button
//                                         className="page-link"
//                                         onClick={() => handlePageChange(currentPage + 1)}
//                                     >
//                                         Next
//                                     </button>
//                                 </li>
//                             </ul>
//                         </nav>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default MunicipalMeeting;






import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./MunicipalMeeting.css";
import pdficon from '../../assets/images/Departments/document 1.png';
import Swal from 'sweetalert2';
import api, { baseURL } from "../api";


const MunicipalMeeting = () => {
    const [selectedButton, setSelectedButton] = useState('');
    const [tableData, setTableData] = useState([]);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [availableButtons, setAvailableButtons] = useState([]);
    const [headersMap, setHeadersMap] = useState({});
    const [bgImage, setBgImage] = useState("");


    // Fetch data from the backend
    useEffect(() => {
        api.get("/muncipal_meetings")
            .then((response) => {
                setTableData(response.data);
                const uniqueNames = [...new Set(response.data.map(item => item.name))];
                setAvailableButtons(uniqueNames);

                const dynamicHeadersMap = {};
                uniqueNames.forEach(name => {
                    dynamicHeadersMap[name] = [
                        `${name} Agenda`,
                        `${name} Minutes`,
                        `${name} Resolution`,
                    ];
                });
                setHeadersMap(dynamicHeadersMap);


                if (uniqueNames.length > 0) {
                    setSelectedButton(uniqueNames[0]);
                }
            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
            });
    }, []);
    useEffect(() => {
        fetchHeaderImage();
    }, []);
    const fetchHeaderImage = async () => {
        try {
            const response = await api.get("/banner");

            if (response.data.length > 0) {
                let selectedBanner = response.data.find(banner => banner.banner_name === "Municipal-meeting");

                if (selectedBanner) {
                    setBgImage(`${baseURL}${selectedBanner.file_path}`);
                } else {
                    console.error("Banner with specified name not found.");
                }
            } else {
                console.error("No banner image found.");
            }
        } catch (error) {
            console.error("Error fetching header image:", error);
        }
    };

    const tableHeaders = headersMap[selectedButton] || [];

    const getTableData = () => {
        return tableData.filter(item => item.name === selectedButton);
    };

    const handleButtonClick = (buttonName) => {
        setSelectedButton(buttonName);
    };


    const filteredData = getTableData().filter((item) =>
        item.year.toLowerCase().includes(searchTerm.toLowerCase())
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

    const updatedTotalEntries = filteredData.length;
    const startEntry = (currentPage - 1) * itemsPerPage + 1;
    const endEntry = Math.min(currentPage * itemsPerPage, updatedTotalEntries);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <>

            <div
                className="history-header-image"
                style={{
                    backgroundImage: `url(${bgImage})`,
                    
                }}
            ></div>
            <div id="main-content">
                <div className="container-fluid font-location mt-4 mb-5" id="accounts-css">
                    <nav className="breadcrumb">
                        <Link to="/" className="breadcrumb-item text-decoration-none">
                            Home
                        </Link>
                        <Link to="#" className="breadcrumb-item text-decoration-none">
                            Corporation
                        </Link>
                        <span className="breadcrumb-item active1">Municipal Meeting</span>
                    </nav>
                    <h2 className="location-title">
                        <span className="highlight">Municipal</span>
                        <span className="highlighted-text"> Meeting</span>
                        <hr />
                    </h2>
                    <div className="row mt-4 row-styling-3" id='municipal-css'>
                        <div className="col-xl-9 col-lg-12 col-md-12 col-sm-12 col-12">
                            <div className="button-group mb-4 d-flex justify-content-start">
                                {availableButtons.map((buttonName) => (
                                    <button
                                        key={buttonName}
                                        className={`btn ${selectedButton === buttonName ? "active" : ""}`}
                                        onClick={() => handleButtonClick(buttonName)}
                                    >
                                        {buttonName}
                                    </button>
                                ))}
                            </div>

                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="entries-wrapper">
                                    <label htmlFor="entries" className="entries-label">Show</label>
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
                                    <label htmlFor="searchInput" className="search-label" style={{ whiteSpace: "nowrap" }}>
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

                            {/* Table Rendering */}
                            <div className="circular-wrapper">
                                <table className="table table-bordered shadow table-responsive">
                                    <thead className="bg-orange text-white">

                                        <tr>
                                            <th className="table-heading-styling text-center" width="8%">Sr. No.</th>
                                            <th className="table-heading-styling" width="50%">Year</th>
                                            {tableHeaders.map((header, index) => (
                                                <th className="table-heading-styling text-center" key={index}>{header}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.map((item, index) => (
                                            <tr key={index}>
                                                <td className="font-large text-center">{startEntry + index}</td> {/* Corrected Serial Number */}
                                                <td>{item.year}</td>
                                                <td className="text-center">
                                                    {item.pdf_link1 && item.pdf_link1 !== "#" ? (
                                                        <Link
                                                            to={item.pdf_link1}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <img
                                                                src={pdficon}
                                                                alt="PDF"
                                                                style={{
                                                                    width: "18px",
                                                                    height: "18px",
                                                                    verticalAlign: "middle",
                                                                }}
                                                            />
                                                        </Link>
                                                    ) : (
                                                        "-"
                                                    )}
                                                </td>
                                                <td className="text-center">
                                                    {item.pdf_link2 && item.pdf_link2 !== "#" ? (
                                                        <Link
                                                            to={item.pdf_link2}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <img
                                                                src={pdficon}
                                                                alt="PDF"
                                                                style={{
                                                                    width: "18px",
                                                                    height: "18px",
                                                                    verticalAlign: "middle",
                                                                }}
                                                            />
                                                        </Link>
                                                    ) : (
                                                        "-"
                                                    )}
                                                </td>
                                                <td className="text-center">
                                                    {item.pdf_link3 && item.pdf_link3 !== "#" ? (
                                                        <Link
                                                            to={item.pdf_link3}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <img
                                                                src={pdficon}
                                                                alt="PDF"
                                                                style={{
                                                                    width: "18px",
                                                                    height: "18px",
                                                                    verticalAlign: "middle",
                                                                }}
                                                            />
                                                        </Link>
                                                    ) : (
                                                        "-"
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div class="last-updated-container">
                                <p className="last-updated-text">
                                    <b>Showing {startEntry} to {endEntry} of {updatedTotalEntries} entries</b>
                                </p>
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

export default MunicipalMeeting;

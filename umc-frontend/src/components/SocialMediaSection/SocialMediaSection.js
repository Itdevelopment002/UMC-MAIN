import "./SocialMediaSection.css";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

const SocialMedia = () => {
  const { t } = useTranslation();

  useEffect(() => {
    const adjustFacebookWidth = () => {
      const fbPage = document.querySelector(".fb-page");
      if (fbPage) {
        fbPage.setAttribute("data-width", fbPage.parentElement.offsetWidth);
        if (window.FB) {
          window.FB.XFBML.parse();
        }
      }
    };

    adjustFacebookWidth();
    window.addEventListener("resize", adjustFacebookWidth);
    return () => window.removeEventListener("resize", adjustFacebookWidth);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="container-fluid" id="social-media-section">
      <div className="citigen">
        <div className="vertical-line"></div>
        <div className="d-flex">
          <h2 className="section-title">
            {t("home.connect")} <span className="subtitle">{t("home.withUs")}</span>
          </h2>
        </div>
      </div>
      <div className="row d-flex justify-content-around social-media-border">
        <div className=" col-lg-4 col-md-6 col-sm-6 media-plugin">

          {/* Facebook Section */}
          <div className="card-header fb text-white text-center">
            {t("home.facebook")}
          </div>
          <div>
            <div
              className="fb-page"
              data-href="https://www.facebook.com/myumc/"
              data-tabs="timeline"
              data-width=""
              data-height="400"
              data-small-header="false"
              data-adapt-container-width="true"
              data-hide-cover="false"
              data-show-facepile="true"
            ></div>
          </div>
        </div>

        {/* Twitter Section */}
        <div className="col-lg-4 col-md-6 col-sm-6 media-plugin">
          <div className="card-header text-white in text-center">
            {t("home.instagram")}
          </div>
          <div align="center" style={{ fontSize: 14 }}>
            <div
              className="instagram-embed-wrapper"
              style={{
                display: "flex",
                width: 600,
                maxWidth: "100%",
                marginTop: 0,
                marginBottom: 0,
              }}
            >
              <iframe
                id="instagram-widget-0"
                scrolling="no"
                frameBorder={0}
                allowFullScreen={true}
                className=""
                title="Instagram Timeline"
                src="https://www.instagram.com/officialdigitalindia/embed"
                style={{
                  position: "static",
                  visibility: "visible",
                  width: 290,
                  height: 400,
                  display: "block",
                  flexGrow: 1,
                }}
              />
            </div>
          </div>
        </div>


        {/* YouTube Section */}
        <div className="col-lg-4 col-md-6 col-sm-6 media-plugin">
          <div className="card-header text-white you text-center">
            {t("home.youTube")}
          </div>
          <div style={{ position: "relative", width: "100%", height: "400px" }}>
            <iframe
              src="https://www.youtube.com/embed/pvH3s3qI8uE?si=dzKrrPwqZBhzM6Xu"
              width="100%"
              height="400"
              title="YouTube video player"
              style={{ pointerEvents: "none" }} // Prevents iframe interaction so link works
            ></iframe>
            <a
              href="https://www.youtube.com/@itdeptulhasnagarmunicipalc9647"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 10,
                cursor: "pointer"
              }}
            ></a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SocialMedia;

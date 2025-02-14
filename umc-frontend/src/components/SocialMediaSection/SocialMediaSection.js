import "./SocialMediaSection.css";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

const SocialMedia = () => {
  const { i18n, t } = useTranslation();

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
        <div className=" col-lg-4 col-md-6 col-sm-6 media-plugin">
          <div className="card-header text-white tw text-center">
          {t("home.twitter")}
          </div>
          <div>
            <div className="twitter-timeline twitter-timeline-rendered">
              <iframe
                id="twitter-widget-0"
                scrolling="no"
                frameBorder="0"
                allowtransparency="true"
                allowFullScreen="true"
                title="Twitter Timeline"
                src="https://syndication.twitter.com/srv/timeline-profile/screen-name/my_umcofficial"
                style={{
                  width: "100%",
                  height: "400px",
                  display: "block",
                  flexGrow: 1,
                }}
              ></iframe>
            </div>
          </div>
        </div>

        {/* YouTube Section */}
        <div className="col-lg-4 col-md-6 col-sm-6 media-plugin">
          <div className="card-header text-white you text-center">
          {t("home.youTube")}
          </div>
          <div>
            <iframe
              src="https://www.youtube.com/embed/playlist?list=UUPZN5zAMeNHt3hTfdCO4n8A"
              width="100%"
              height="400"
              title="YouTube Playlist"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMedia;

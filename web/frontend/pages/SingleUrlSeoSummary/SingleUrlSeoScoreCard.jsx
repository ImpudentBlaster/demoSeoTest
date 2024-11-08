import React, { useState, useEffect, useCallback } from "react";
import { Card, Page, Layout, TextContainer, Text } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "../SeoPageSummary/SEOPageSummary.css";

export default function SingleUrlScoreCard() {
  useEffect(() => {
    const temp = JSON.parse(localStorage.getItem("clickedUrlData"));
    const score = temp.lighthouseResult.categories.seo.score * 100;
    setProgressPercentage(score);
  }, []);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const getColor = (percentage) => {
    if (percentage < 50) return "red";
    if (percentage >= 50 && percentage < 90) return "rgb(255, 170, 51)";
    return "#01a522";
  };
  const bgColor = (percentage) => {
    if (percentage < 50) return "rgba(255,0,0,0.1)";
    if (percentage >= 50 && percentage < 90) return "rgba(255, 170, 51 , 0.1)";
    return "rgba(1, 165, 34,0.1)";
  };
  const trailColor = (percentage) => {
    if (percentage < 50) return "rgba(255,0,0,0.1)";
    if (percentage >= 50 && percentage < 90)
      return "rgba(255, 170, 51 , 0.005)";
    return "rgba(1, 165, 34,0.005)";
  };
  return (
    <Page>
      {/* <TitleBar title="SEO Audit" /> */}
      <Layout>
        <Layout.Section>
          <div className="top">
            <Card title="Store SEO Score" sectioned>
              <TextContainer>
                <div style={{ width: "150px", margin: "0 auto" }}>
                  <CircularProgressbar
                    background
                    value={progressPercentage}
                    text={`${progressPercentage}`}
                    styles={buildStyles({
                      textColor: getColor(progressPercentage),
                      pathColor: getColor(progressPercentage),
                      trailColor: trailColor(progressPercentage),
                      backgroundColor: bgColor(progressPercentage),
                    })}
                  />
                </div>
              </TextContainer>
            </Card>

            <Card sectioned style={{ maxWidth: "400px", margin: "20px auto" }}>
              <TextContainer>
                <Text variant="bodyMd">
                  Estimated monthly traffic increase after solving 16 found
                  issues:
                  <br />
                  <strong>8.1%</strong>
                </Text>
              </TextContainer>
            </Card>
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

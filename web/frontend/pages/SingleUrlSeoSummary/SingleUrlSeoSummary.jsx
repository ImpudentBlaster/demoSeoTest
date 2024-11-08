import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  Collapsible,
  Icon,
  Stack,
  TextStyle,
  Banner,
  Page,
} from "@shopify/polaris";
import { ChevronDownMinor, ChevronUpMinor } from "@shopify/polaris-icons";
import "./SingleUrlSeoSummary.css";

import { TiDeleteOutline } from "react-icons/ti";
import { RiErrorWarningLine } from "react-icons/ri";
import { FaRegCircleCheck } from "react-icons/fa6";
import SingleUrlSeoScoreCard from "./SingleUrlSeoScoreCard";
import { useNavigate } from "react-router-dom";
const SingleUrlSeoSummary = ({ error }) => {
  console.log(window.location)
  const navigate = useNavigate();
  const [openCritical, setOpenCritical] = useState(false);
  const [openImprovement, setOpenImprovement] = useState(false);
  const [openGood, setOpenGood] = useState(false);
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState();
  const [critical, setCritical] = useState();
  const [improvement, setImprovement] = useState();
  const [good, setGood] = useState();

  useEffect(() => {
    setLoading(true);
    const temp = localStorage.getItem("clickedUrlData");
    setResponse(JSON.parse(temp));
  }, []);

  useEffect(() => {
    if (response) {
      const audits = response.lighthouseResult.audits;
      const auditRefs = response.lighthouseResult.categories.seo.auditRefs;
      const temp = auditRefs.map((item) => {
        return audits[item.id];
      });

      setCritical(
        Object.values(temp)
          .filter((audit) => {
            if (audit.score !== null) return audit.score < 0.5;
          })
          .map((audit) => ({
            id: audit.id,
            title: audit.title || audit.id,
          }))
      );

      setImprovement(
        Object.values(temp)
          .filter((audit) => audit.score >= 0.5 && audit.score < 0.9)
          .map((audit) => ({
            id: audit.id,
            title: audit.title || audit.id,
          }))
      );

      setGood(
        Object.values(temp)
          .filter((audit) => audit.score >= 0.9)
          .map((audit) => ({
            id: audit.id,
            title: audit.title || audit.id,
          }))
      );

      setLoading(false);
    }
  }, [response]);
  function handleBack() {
    const searchParams = new URLSearchParams(window.location.search);
    const shopName = searchParams.get('shop')
    navigate(`/OnPageSeoAudit/OnPageSeoAudit?shop=${shopName}`);
  }
  return (
    <Page
      backAction={{ content: "products", onAction: handleBack }}
      title="Seo Summary"
    >
      <div className="seo-summary-main">
        <SingleUrlSeoScoreCard />
        <div className="seo-summary">
          <Card title="SEO Audit: Summary">
            {loading && (
              <Banner status="info">Loading SEO audit data...</Banner>
            )}
            {error && <Banner status="critical">{error}</Banner>}
            <Stack vertical>
              {/* Critical Section */}
              <Card.Section>
                <Stack alignment="center" distribution="equalSpacing">
                  <TextStyle variation="strong">
                    <p className="summary-headings">
                      <TiDeleteOutline
                        style={{
                          color: "rgba(222, 0, 0, 0.9)",
                          fontSize: "1.30rem",
                        }}
                      />{" "}
                      Critical ({critical ? critical.length : 0})
                    </p>
                  </TextStyle>
                  <div
                    onClick={() => setOpenCritical(!openCritical)}
                    style={{ cursor: "pointer" }}
                  >
                    <Icon
                      source={openCritical ? ChevronUpMinor : ChevronDownMinor}
                    />
                  </div>
                </Stack>
                <Collapsible open={openCritical}>
                  <ul className="SEOPageSummary-critical-list">
                    {critical &&
                      critical.map((item, index) => (
                        <li key={index}>{item.title}</li>
                      ))}
                  </ul>
                </Collapsible>
              </Card.Section>

              {/* Need Improvement Section */}
              <Card.Section>
                <Stack alignment="center" distribution="equalSpacing">
                  <TextStyle variation="strong">
                    <p className="summary-headings">
                      <RiErrorWarningLine
                        style={{
                          color: "rgb(255, 170, 51)",
                          fontSize: "1.30rem",
                          fontWeight: 600,
                        }}
                      />{" "}
                      Need Improvement ({improvement ? improvement.length : 0})
                    </p>
                  </TextStyle>
                  <div
                    onClick={() => setOpenImprovement(!openImprovement)}
                    style={{ cursor: "pointer" }}
                  >
                    <Icon
                      source={
                        openImprovement ? ChevronUpMinor : ChevronDownMinor
                      }
                    />
                  </div>
                </Stack>
                <Collapsible open={openImprovement}>
                  <ul className="SEOPageSummary-improvement-list">
                    {improvement &&
                      improvement.map((item, index) => (
                        <li key={index}> {item.title}</li>
                      ))}
                  </ul>
                </Collapsible>
              </Card.Section>

              {/* Good Section */}
              <Card.Section>
                <Stack alignment="center" distribution="equalSpacing">
                  <TextStyle variation="strong">
                    <p className="summary-headings">
                      <FaRegCircleCheck
                        style={{ color: "01a522", fontSize: "1.25rem" }}
                      />{" "}
                      Good ({good ? good.length : 0})
                    </p>
                  </TextStyle>
                  <div
                    onClick={() => setOpenGood(!openGood)}
                    style={{ cursor: "pointer" }}
                  >
                    <Icon
                      source={openGood ? ChevronUpMinor : ChevronDownMinor}
                    />
                  </div>
                </Stack>
                <Collapsible open={openGood}>
                  <ul className="SEOPageSummary-good-list">
                    {good &&
                      good.map((item, index) => (
                        <li key={index}> {item.title}</li>
                      ))}
                  </ul>
                </Collapsible>
              </Card.Section>
            </Stack>
          </Card>
        </div>
      </div>
    </Page>
  );
};

export default SingleUrlSeoSummary;

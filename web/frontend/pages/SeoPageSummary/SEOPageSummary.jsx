import React, { useState, useEffect } from "react";
import {
  Card,
  Collapsible,
  Icon,
  Stack,
  TextStyle,
  Banner,
} from "@shopify/polaris";
import { ChevronDownMinor, ChevronUpMinor } from "@shopify/polaris-icons";
import SeoScoreCard from '../SeoScoreCard/SeoScoreCard'
import "./SEOPageSummary.css";

// import SeoScoreCard from "../SeoScoreCard/SeoScoreCard";
import { TiDeleteOutline } from "react-icons/ti";
import { RiErrorWarningLine } from "react-icons/ri";
import { FaRegCircleCheck } from "react-icons/fa6";
const SEOSummary = ({
  pageSummaryData,
  seoScore,
  totalPages,
  spinnerLoading,
  seoPageSummaryLoading,
  error,
}) => {
  console.log(seoPageSummaryLoading , "seoPageSummaryLoading")
  const [openCritical, setOpenCritical] = useState(false);
  const [openImprovement, setOpenImprovement] = useState(false);
  const [openGood, setOpenGood] = useState(false);

  Object.keys(pageSummaryData.critical).forEach((key) => {
    if (key in pageSummaryData.good) {
      delete pageSummaryData.good[key];
    }
  });

  let critical = Object.values(pageSummaryData.critical).reduce(
    (accumulator, value) => accumulator + value,
    0
  );
  let improvement = Object.values(pageSummaryData.improvement).reduce(
    (accumulator, value) => accumulator + value,
    0
  );
  let good = Object.values(pageSummaryData.good).reduce(
    (accumulator, value) => accumulator + value,
    0
  );

  return (
    <div className="seo-summary-main">
      <SeoScoreCard
        totalPages={totalPages}
        seoScore={seoScore}
        spinnerLoading={spinnerLoading}
      />
      <div className="seo-summary">
        <Card title="SEO Audit: Summary">
          {seoPageSummaryLoading && (
            <Banner status="info">Loading SEO audit data...</Banner>
          )}
          {/* {error && <Banner status="critical">Failed to load the data</Banner>} */}
          <Stack vertical>
            <Card.Section>
              <Stack alignment="center" distribution="equalSpacing">
                <TextStyle variation="strong">
                  <p className="summary-headings">
                    <TiDeleteOutline
                      style={{
                        color: "rgba(222, 0, 0, 0.9)",
                        fontSize: "1.30rem",
                      }}
                    />
                    Critical ({critical})
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
                  {Object.keys(pageSummaryData.critical).map((key, index) => (
                    <li key={index}>
                      <p>
                        <span>{key}</span>
                        <span>{pageSummaryData.critical[key]}</span>
                      </p>
                    </li>
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
                    Need Improvement ({improvement})
                  </p>
                </TextStyle>
                <div
                  onClick={() => setOpenImprovement(!openImprovement)}
                  style={{ cursor: "pointer" }}
                >
                  <Icon
                    source={openImprovement ? ChevronUpMinor : ChevronDownMinor}
                  />
                </div>
              </Stack>
              <Collapsible open={openImprovement}>
                <ul className="SEOPageSummary-improvement-list">
                  {Object.keys(pageSummaryData.improvement).map(
                    (key, index) => (
                      <li key={index}>
                        <p>
                          <span>{key}</span>
                          <span>{pageSummaryData.improvement[key]}</span>
                        </p>
                      </li>
                    )
                  )}
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
                    Good ({good})
                  </p>
                </TextStyle>
                <div
                  onClick={() => setOpenGood(!openGood)}
                  style={{ cursor: "pointer" }}
                >
                  <Icon source={openGood ? ChevronUpMinor : ChevronDownMinor} />
                </div>
              </Stack>
              <Collapsible open={openGood}>
                <ul className="SEOPageSummary-good-list">
                  {Object.keys(pageSummaryData.good).map((key, index) => (
                    <li key={index}>
                      <p>
                        <span>{key}</span>
                        <span>{pageSummaryData.good[key]}</span>
                      </p>
                    </li>
                  ))}
                </ul>
              </Collapsible>
            </Card.Section>
          </Stack>
        </Card>
      </div>
    </div>
  );
};

export default SEOSummary;

import {
    CalloutCard,
    Button,
    Grid,
    MediaCard,
    Page,
    LegacyCard,
    Stack,
  } from "@shopify/polaris";
  import { TitleBar } from "@shopify/app-bridge-react";
  import { useTranslation } from "react-i18next";
  import "./SEO_Booster.css"; // Adjust the path if necessary
  import { replace, useNavigate } from "react-router-dom";
  
  
  const services = [
    {
      title: "Structured data/Google schemas/rich snippets/JSON-LD",
      description:
        "Adding structured data can enable search results that are more engaging to users and might encourage them to interact more with your website, which are called rich results.",
      buttonText: "Configure",
      url: "/Structured_data",
    },
    {
      title: "Meta title/description optimization",
      description:
        "Optimize your meta title and meta description will help search engines better understand your pages and also make them more engaging to users on search results.",
      buttonText: "Configure",
    },
    {
      title: "Product image alt optimization",
      description:
        "Optimize your product image alt texts, in bulk or automatically, to help search engines better understand your content and for your images to rank on Google Images.",
      buttonText: "Configure",
    },
    {
      title: "Broken links",
      description:
        "Automatically 301 redirect all broken (404) links to the page of your choice to avoid interrupting user experience and create a better signal to search engines.",
      buttonText: "Upgrade",
    },
    {
      title: "Keyword research",
      description:
        "Generate keyword ideas for your business, along with their statistics such as search volume data and competition. You can use these ideas to optimize your on-page SEO and for blog content creation.",
      buttonText: "Upgrade",
    },
    {
      title: "Noindex",
      description:
        "Block Google and other search engines from indexing a page so that it wont appear in Search results. For example when a page is not ready to show to users.",
      buttonText: "Upgrade",
    },
    {
      title: "Increase traffic with Backlink",
      description:
        "Offering a wide range of professional content services includes: Keyword optimization and research, Content audit and Content writing. Staring from only $50/content.",
      buttonText: "Get Quotation",
    },
    {
      title: "Increase ranking with Content",
      description:
        "Offering a wide range of professional content services includes: Keyword optimization and research, Content audit and Content writing. Staring from only $50/content.",
      buttonText: "Get Quotation",
    },
  ];
  
  export default function SEO_Booster() {
    console.log(window.location)
    const { t } = useTranslation();
    const navigate = useNavigate();
  
    
    const navigateHanlde = (url) => {
      if (url) {
        const urlParams = new URLSearchParams(window.location.search);
        const shopName = urlParams.get('shop');
        navigate(`${url}?shop=${shopName}`); // Dynamically navigate to the URL
      } else {
        console.log("URL not found");
      }
    };
  
    function handleBackAction () {
      navigate('/SeoAuditMain/SeoAuditMain')
    }
  
    return (
      <div style={{  padding:"0 4rem"}}>
        <Page title="SEO Booster" backAction={{ content: "Products", onAction:handleBackAction }}>
          <MediaCard
            title="Features to improve your website SEO rankings"
            description="These features below all help to make your website more SEO-friendly and look better to search engines, thus improve your SEO performance and ultimately leads to more traffic and sales."
            popoverActions={[{ content: "Dismiss", onAction: () => {} }]}
          >
            <img
              alt="SEO Booster"
              width="100%"
              height="auto" // Change to auto to maintain aspect ratio
              style={{
                objectFit: "cover",
                objectPosition: "center",
                maxHeight: "200px", // Set a maximum height
              }}
              src="https://d3lks6njuyuuik.cloudfront.net/pb/pub/media/Tapita/seo/seobooster.jpg"
            />
          </MediaCard>
  
          {/* Responsive grid for the LegacyCards */}
          <div className=" gird_container">
            <Grid>
              {services.map((service, index) => (
                <Grid.Cell
                  key={index}
                  columnSpan={{ xs: 12, sm: 6, md: 6, lg: 6 }} // Full width on xs, 2 cards per row on larger screens
                >
                  <LegacyCard title={service.title} sectioned>
                    <Stack distribution="equalSpacing" alignment="center">
                      <p>{service.description}</p>
                      <div style={{ marginLeft: "auto" }}>
                        <Button
                          onClick={() => navigateHanlde(service.url)}
                          className="black-button"
                          variant="primary"
                        >
                          {service.buttonText}
                        </Button>
                      </div>
                    </Stack>
                  </LegacyCard>
                </Grid.Cell>
              ))}
            </Grid>
            <div className="CalloutCard_container">
              <CalloutCard
                title="HOT: All-in-one Package"
                illustration="https://d3lks6njuyuuik.cloudfront.net/pb/pub/media/Tapita/seo/aio_gift.png"
                primaryAction={{
                  content: "View package details",
                  url: "#",
                }}
              >
                <p>
                  We will take care of your store from SEO to loading speed. All
                  you have to do is focusing on sales. If you want a package that
                  gives you the best value and peace of mind, this one is for you.
                </p>
              </CalloutCard>
            </div>
          </div>
        </Page>
      </div>
    );
  }
  
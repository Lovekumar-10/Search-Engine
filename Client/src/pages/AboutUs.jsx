
import React from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slide,
  Fade,
} from "@mui/material";

// Timeline imports
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Footer from "../components/Footer";
// Icons
import SearchIcon from "@mui/icons-material/Search";
import HistoryIcon from "@mui/icons-material/History";
import PersonIcon from "@mui/icons-material/Person";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Trans } from "react-i18next";

// Variants for animation
const fadeIn = (direction = "up", delay = 0) => {
  let x = 0,
    y = 0;
  if (direction === "left") x = -100;
  if (direction === "right") x = 100;
  if (direction === "up") y = -100;
  if (direction === "down") y = 100;

  return {
    hidden: { opacity: 0, x, y },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.8, delay },
    },
  };
};

const AboutUs = () => {
  const theme = useTheme();
   const { t } = useTranslation();  

  return (
    <Box
      sx={{
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        maxHeight: "100vh",
        overflowY: "auto",
        "&::-webkit-scrollbar": { width: "4px" },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#202020b5",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
        
        
      }}
    >
      {/* Hero Section */}
      <Box
  sx={{
    height: { xs: "60vh", md: "80vh" },
    backgroundImage:
      "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1470&q=80')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    textAlign: "center",
    px: 3,
    position: "relative",
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.4)",
      zIndex: -1,  
    },
  }}
>
  <Fade in={true} timeout={1500}>
    <Typography
      variant="h2"
      sx={{
        fontWeight: "bold",
        mb: 2,
        fontSize: { xs: "2rem", md: "3.5rem" },
      }}
    >
     {t("about.hero.title")}
    </Typography>
  </Fade>
  <Fade in={true} timeout={2000}>
    <Typography
      variant="h5"
      sx={{
        mb: 4,
        fontSize: { xs: "1rem", md: "1.5rem" },
      }}
    >
      {/* Fast, personalized, and reliable search results across Web, YouTube,
      and News */}
      {t("about.hero.subtitle")}
    </Typography>
  </Fade>
  <Slide direction="up" in={true} timeout={2200}>
    <Button
      variant="contained"
      color="primary"
      sx={{
        px: 4,
        py: 1.5,
        fontSize: { xs: "0.8rem", md: "1rem" },
      }}
    >
      {t("about.hero.btn")}
    </Button>
  </Slide>
</Box>


      {/* Features Section */}
      <Box
        sx={{
          py: 10,
          px: { xs: 3, md: 10 },
          bgcolor: theme.palette.background.default,
        }}
      >
        <Typography
          variant="h4"
          color="primary"
          mb={5}
          textAlign="center"
          fontWeight="bold"
        >
          {t("about.features.title")}
        </Typography>

        {/* Desktop View (Timeline) */}
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <Timeline position="alternate">
            <TimelineItem>
              <TimelineOppositeContent color="text.secondary">
                {t("about.features.timeline1")}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot color="primary">
                  <SearchIcon />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="h6"> {t("about.features.headline1")} </Typography>
                <Typography>
                   {t("about.features.title1")}
                </Typography>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineOppositeContent color="text.secondary">
                  {t("about.features.timeline2")}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot color="secondary">
                  <HistoryIcon />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="h6">{t("about.features.headline2")}</Typography>
                <Typography>
                   {t("about.features.title2")}
                </Typography>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineOppositeContent color="text.secondary">
                {t("about.features.timeline3")}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot color="success">
                  <PersonIcon />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="h6"> {t("about.features.headline3")}</Typography>
                <Typography>
                   {t("about.features.title3")}
                </Typography>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineOppositeContent color="text.secondary">
                 {t("about.features.timeline4")}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot color="warning">
                  <FlashOnIcon />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="h6">{t("about.features.headline4")}</Typography>
                <Typography>
                  {t("about.features.title4")}
                </Typography>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </Box>

        {/* Mobile View (Cards) */}
        <Grid container spacing={3} sx={{ display: { xs: "flex", md: "none" } }}>
          {[
            {
              title: "Multi-source Search",
              desc: "Get results from Web, Videos, and News in one place.",
              icon: <SearchIcon color="primary" />,
            },
            {
              title: "Recent Searches",
              desc: "Quick access to your last searches for efficiency.",
              icon: <HistoryIcon color="secondary" />,
            },
            {
              title: "Personalized Results",
              desc: "Future feature: tailored searches for logged-in users.",
              icon: <PersonIcon color="success" />,
            },
            {
              title: "Fast & Clean UI",
              desc: "A simple, responsive, and easy-to-use interface.",
              icon: <FlashOnIcon color="warning" />,
            },
          ].map((feature, idx) => (
            <Grid item xs={12} sm={6} key={idx}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: "background.paper",
                  boxShadow: 3,
                  textAlign: "center",
                }}
              >
                {feature.icon}
                <Typography variant="h6" mt={2} mb={1}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>


            {/* Founder Section */}
      <Box
        sx={{
          py: 10,
          px: { xs: 3, md: 10 },
          mt: 5,
          backgroundColor: "theme.palette.background.default",
            backgroundImage: `
              linear-gradient(rgba(192,192,192,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(192,192,192,0.3) 1px, transparent 1px)
            `,
          backgroundSize: "40px 40px",
         
          position: "relative",
          color: "#fff",
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
           
            zIndex: -1,
          },
        }}
      >
        <Grid
          container
          spacing={4}
          alignItems="center"
          sx={{ position: "relative", display:"flex"}}
        >
          {/* Left: Image */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.3 }}
            >
             <Box
  component="img"
  src="..\..\src\assets\LOVE.jpeg"
  alt="Founder"
  sx={{
    width: { xs: "250px", sm: "300px", md: "400px" }, // responsive width
    height: { xs: "250px", sm: "300px", md: "400px" }, // responsive height
    // borderRadius: "200px 0 200px 0", // custom corners
    // border: "10px solid #000000ff", // border color and width
    objectFit: "cover", // keeps aspect ratio
    display: "block",
    margin: "0 auto", // centers the image in its container
    boxShadow: "0px 8px 24px rgba(0,0,0,0.3)",
    transition: "0.4s",
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: "0px 15px 40px rgba(0,0,0,0.5)",
    },
  }}
/>

            </motion.div>
          </Grid>

          {/* Right: Text + Socials */}
          <Grid item xs={12} md={6} sx={{
            color: theme.palette.text.primary,
          }} >
            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <Typography
                variant="h3"
                color="primary"
                fontWeight="bold"
                gutterBottom
              >
                {t("about.founder.title")}
              </Typography>
            </motion.div>

            {/* Paragraph */}
            <motion.div
            variants={fadeIn("right", 0.4)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <Typography variant="body1" paragraph>
              {/* Our founder  <strong>Mr. Love kumar </strong> is a   <strong>visionary</strong> who believes in simplicity, <br />
              peed, and innovation With a deep understanding of technology and a <br />
              passion for creating  platforms, they envisioned a tool that makes searching <br />
             smarter, faster, and more   personalized. Guided by creativity and dedication, <br />
             the founder’s mission has  always been to bridge the gap between complex  <br />
             information and easy  access for everyone. */}
              <Trans
                i18nKey="about.founder.para1"
                components={{ strong: <strong />, br: <br /> }}
              />
            </Typography>
          </motion.div>

          <motion.div
            variants={fadeIn("right", 0.6)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <Typography variant="body1"  paragraph>
             {/* Built on this vision, our search engine combines web, video,  <br />
             and news results in one unified platform. It is designed to  <br />
             save users time and provide the most relevant results efficiently. <br />
             With features like AI-powered insights, personalized suggestions,  <br />
             and a clean, intuitive interface, the platform aims to transform <br />
             the way people explore, learn, and discover information online. <br /> */}
             <Trans
                i18nKey="about.founder.para2"
                components={{ br: <br /> }}
              />
            </Typography>
          </motion.div>

            {/* Social Media Icons */}
            <motion.div
              initial={{ opacity: 0, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap" }}>
                {[
                  { icon: <FacebookIcon />, link: "https://www.facebook.com/share/1ANwjwjKBM/" },
                  { icon: <InstagramIcon />, link: "https://www.instagram.com/love_kumar9654" },
                  { icon: <WhatsAppIcon />, link: "https://wa.me/9654662096?text=Hello%20Lovekumar.0!%20I%20am%20interested%20in%20learning%20more%20about%20your%20search%20engine%20project.%20Can%20you%20please%20guide%20me?" },
                  { icon: <LinkedInIcon />, link: "https://www.linkedin.com/in/love-kumar96" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{
                      scale: 1.2,
                      rotate: 10,
                    }}
                  >
                    <IconButton
                      color="primary"
                      component="a"
                      href={item.link}
                      target="_blank"
                      sx={{
                        backgroundColor: "white",
                        borderRadius: "50%",
                        boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
                        transition: "all 0.3s",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #45013bff 0%, #000000ff 100%)",
                          color: "white",
                        },
                      }}
                    >
                      {item.icon}
                    </IconButton>
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Box>

      {/* FAQ Section */}
      <Box sx={{ py: 10, px: { xs: 2, md: 10 }, backgroundColor: "#f9f9f9" }}>
        <Typography
          variant="h4"
          color="primary"
          mb={4}
          textAlign="center"
          fontWeight="bold"
        >
          {t("about.faq.title")}
        </Typography>
        {[
          {
            question: t("about.faq.question1"),
            answer: t("about.faq.answer1"),
          },
          {
            question: t("about.faq.question2"),
            answer: t("about.faq.answer2"),
              
          },
          {
            question: t("about.faq.question3"),
            answer: t("about.faq.answer3"),
              
          },
           {
            question: t("about.faq.question4"),
            answer: t("about.faq.answer4"),
              
          },
          {
            question: t("about.faq.question5"),
            answer: t("about.faq.answer5"),
              
          },
         
           {
            question: t("about.faq.question6"),
            answer: t("about.faq.answer6"),
              
          },
           {
            question: t("about.faq.question7"),
            answer: t("about.faq.answer7"),
              
          },
           {
            question: t("about.faq.question8"),
            answer: t("about.faq.answer8"),
              
          },
        

        ].map((item, idx) => (
          <Accordion key={idx} sx={{ mb: 2, borderRadius: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight="bold">
                {item.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">{item.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
      <Footer/>

      
    </Box>
  );
};

export default AboutUs;

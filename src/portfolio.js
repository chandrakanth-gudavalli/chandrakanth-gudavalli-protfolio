/* Change this file to get your personal Porfolio */

// Website related settings
const settings = {
  isSplash: false, // Change this to false if you don't want Splash screen.
};

//SEO Related settings
const seo = {
  title: "Chandrakanth Gudavalli",
  description:
    "Computer Vision Researcher trying to make my GPUs imagine/grasp things better than me (WIP).",
  og: {
    title: "Chandrakanth Gudavalli",
    type: "website",
    url: "http://chandrakanthgudavalli.com/",
  },
};

//Home Page
const greeting = {
  title: "Chandrakanth Gudavalli",
  logo_name: "Gudavalli",
  nickname: "chandu",
  subTitle:
    "Computer Vision Researcher trying to make my GPUs imagine/grasp things better than me (WIP).",
  resumeLink:
    "https://drive.google.com/file/d/13R7CXPPcSBFwaRttx3dG7rRREBpiDNdQ/view?usp=sharing",
  portfolio_repository:
    "https://drive.google.com/file/d/13R7CXPPcSBFwaRttx3dG7rRREBpiDNdQ/view?usp=sharing",
  githubProfile: "https://github.com/chandrakanth-gudavalli",
};

const socialMediaLinks = [
  /* Your Social Media Link */
  // github: "https://github.com/ashutosh1919",
  // linkedin: "https://www.linkedin.com/in/ashutosh-hathidara-88710b138/",
  // gmail: "ashutoshhathidara98@gmail.com",
  // gitlab: "https://gitlab.com/ashutoshhathidara98",
  // facebook: "https://www.facebook.com/laymanbrother.19/",
  // twitter: "https://twitter.com/ashutosh_1919",
  // instagram: "https://www.instagram.com/layman_brother/"

  {
    name: "LinkedIn",
    link: "https://www.linkedin.com/in/gudavallic",
    fontAwesomeIcon: "fa-linkedin-in", // Reference https://fontawesome.com/icons/linkedin-in?style=brands
    backgroundColor: "#0077B5", // Reference https://simpleicons.org/?q=linkedin
  },
  {
    name: "Github",
    link: "https://github.com/chandrakanth-gudavalli",
    fontAwesomeIcon: "fa-github", // Reference https://fontawesome.com/icons/github?style=brands
    backgroundColor: "#181717", // Reference https://simpleicons.org/?q=github
  },
  {
    name: "Gmail",
    link: "mailto:chandrakanthgudavalli@gmail.com",
    fontAwesomeIcon: "fa-google", // Reference https://fontawesome.com/icons/google?style=brands
    backgroundColor: "#D14836", // Reference https://simpleicons.org/?q=gmail
  },
];

const skills = {
  data: [
    {
      title: "Media Forensics",
      fileName: "DataScienceImg",
      skills: [
        "⚡ All fake images doesn't look fake at the first glance.",
        "⚡ Images can be manipulated using several foregery techniques like splicing, seam carving, inpainting, GANs, and so on.",
        "⚡ I have expertise in developing forensic tools that can verify the authenticity of given image database.",
        "⚡ I was part of 4 year MediFor project (MEdia FORensics) funded by the US federal agencies." +
          " Worked towards the development of both hollistic forensic tools and forgery specific forensic tools.",
        // "⚡ Complex quantitative modelling for dynamic forecasting and time series analysis",
      ],
      softwareSkills: [
        {
          skillName: "Tensorflow",
          fontAwesomeClassname: "logos-tensorflow",
          style: {
            backgroundColor: "transparent",
          },
        },
        {
          skillName: "Keras",
          fontAwesomeClassname: "simple-icons:keras",
          style: {
            backgroundColor: "white",
            color: "#D00000",
          },
        },
        {
          skillName: "PyTorch",
          fontAwesomeClassname: "logos-pytorch",
          style: {
            backgroundColor: "transparent",
          },
        },
        {
          skillName: "Python",
          fontAwesomeClassname: "ion-logo-python",
          style: {
            backgroundColor: "transparent",
            color: "#3776AB",
          },
        },
      ],
    },
    {
      title: "Generative Adversarial Networks",
      fileName: "FullStackImg",
      skills: [
        "⚡ GANs are known for generating synthetic media that look authentic to human eye.",
        "⚡ Developed GANs that can generate satellite images that align with input semantic maps.",
        "⚡ Built GAN based image editing frameworks that can remove/insert objects in images.",
      ],
      softwareSkills: [
        {
          skillName: "HTML5",
          fontAwesomeClassname: "simple-icons:html5",
          style: {
            color: "#E34F26",
          },
        },
        {
          skillName: "CSS3",
          fontAwesomeClassname: "fa-css3",
          style: {
            color: "#1572B6",
          },
        },
        {
          skillName: "Sass",
          fontAwesomeClassname: "simple-icons:sass",
          style: {
            color: "#CC6699",
          },
        },
        {
          skillName: "JavaScript",
          fontAwesomeClassname: "simple-icons:javascript",
          style: {
            backgroundColor: "#000000",
            color: "#F7DF1E",
          },
        },
        {
          skillName: "ReactJS",
          fontAwesomeClassname: "simple-icons:react",
          style: {
            color: "#61DAFB",
          },
        },
        {
          skillName: "NodeJS",
          fontAwesomeClassname: "simple-icons:node-dot-js",
          style: {
            color: "#339933",
          },
        },
        {
          skillName: "NPM",
          fontAwesomeClassname: "simple-icons:npm",
          style: {
            color: "#CB3837",
          },
        },
        {
          skillName: "Yarn",
          fontAwesomeClassname: "simple-icons:yarn",
          style: {
            color: "#2C8EBB",
          },
        },
        {
          skillName: "Gatsby",
          fontAwesomeClassname: "simple-icons:gatsby",
          style: {
            color: "#663399",
          },
        },
        {
          skillName: "Flutter",
          fontAwesomeClassname: "simple-icons:flutter",
          style: {
            color: "#02569B",
          },
        },
      ],
    },
    {
      title: "Malware Classification",
      fileName: "CloudInfraImg",
      skills: [
        "⚡ Cyber attacks and new malware count is increasing day by day. Many existing malware detection solutions" +
          " are not found to be succesful in many scenarios.",
        "⚡ Worked towards development of other orthogonal techniques to detect malware.",
        "⚡ Developed image based and audio based techniques to detect malware.",
        "⚡ Developed a tool called MalSee that does image based analysis for malware classification.",
        "⚡ Checkout MalSee at https://malsee.mayachitra.com/",
      ],
      softwareSkills: [
        {
          skillName: "GCP",
          fontAwesomeClassname: "simple-icons:googlecloud",
          style: {
            color: "#4285F4",
          },
        },
        {
          skillName: "AWS",
          fontAwesomeClassname: "simple-icons:amazonaws",
          style: {
            color: "#FF9900",
          },
        },
        {
          skillName: "Azure",
          fontAwesomeClassname: "simple-icons:microsoftazure",
          style: {
            color: "#0089D6",
          },
        },
        {
          skillName: "Firebase",
          fontAwesomeClassname: "simple-icons:firebase",
          style: {
            color: "#FFCA28",
          },
        },
        {
          skillName: "PostgreSQL",
          fontAwesomeClassname: "simple-icons:postgresql",
          style: {
            color: "#336791",
          },
        },
        {
          skillName: "MongoDB",
          fontAwesomeClassname: "simple-icons:mongodb",
          style: {
            color: "#47A248",
          },
        },
        {
          skillName: "Docker",
          fontAwesomeClassname: "simple-icons:docker",
          style: {
            color: "#1488C6",
          },
        },
        {
          skillName: "Kubernetes",
          fontAwesomeClassname: "simple-icons:kubernetes",
          style: {
            color: "#326CE5",
          },
        },
      ],
    },
    {
      title: "Satellite Image Analysis",
      fileName: "DesignImg",
      skills: [
        "⚡ Worked extensively on satellite images in last two years (2020, 2021).",
        "⚡ Good expertise in dealing with several types of metadata (RPC, time, location, and so on) associated with it.",
        "⚡ Expertise in dealing with elevation maps/hillshades.",
        "⚡ Worked on registering images captured by one satellite with images from other satellite or drone (WIP).",
      ],
      softwareSkills: [
        {
          skillName: "Adobe XD",
          fontAwesomeClassname: "simple-icons:adobexd",
          style: {
            color: "#FF2BC2",
          },
        },
        {
          skillName: "Figma",
          fontAwesomeClassname: "simple-icons:figma",
          style: {
            color: "#F24E1E",
          },
        },
        {
          skillName: "Adobe Illustrator",
          fontAwesomeClassname: "simple-icons:adobeillustrator",
          style: {
            color: "#FF7C00",
          },
        },
        {
          skillName: "Inkscape",
          fontAwesomeClassname: "simple-icons:inkscape",
          style: {
            color: "#000000",
          },
        },
      ],
    },
  ],
};

// Education Page
const competitiveSites = {
  competitiveSites: [
    {
      siteName: "HackerRank",
      iconifyClassname: "simple-icons:hackerrank",
      style: {
        color: "#2EC866",
      },
      profileLink: "https://www.hackerrank.com/layman_brother",
    },
    {
      siteName: "Codechef",
      iconifyClassname: "simple-icons:codechef",
      style: {
        color: "#5B4638",
      },
      profileLink: "https://www.codechef.com/users/ashutosh_1919",
    },
    {
      siteName: "Codeforces",
      iconifyClassname: "simple-icons:codeforces",
      style: {
        color: "#1F8ACB",
      },
      profileLink: "http://codeforces.com/profile/layman_brother",
    },
    {
      siteName: "Hackerearth",
      iconifyClassname: "simple-icons:hackerearth",
      style: {
        color: "#323754",
      },
      profileLink: "https://www.hackerearth.com/@ashutosh391",
    },
    {
      siteName: "Kaggle",
      iconifyClassname: "simple-icons:kaggle",
      style: {
        color: "#20BEFF",
      },
      profileLink: "https://www.kaggle.com/laymanbrother",
    },
  ],
};

const degrees = {
  degrees: [
    {
      title: "University of Colorado",
      subtitle: "Masters in Electrical Engineering",
      logo_path: "ucd.png",
      alt_name: "CU Denver",
      duration: "2017 - 2019",
      descriptions: [
        "⚡ Major: Computer Vision and Embedded Systems.",
        "⚡ Worked as Research Assistant under my computer vision professor and data science professor.",
        "⚡ Courses I attended include - Digital Image Processing, Algorithms and Data Structures, Probability theory, Applied Statistics, Engineering Mathematics, Signals and Systems",
      ],
      website_link: "https://www.ucdenver.edu/",
    },
    {
      title: "Jawaharlal Nehru Technological University Hyderabad",
      subtitle: "B.Tech. in Electronics and Communication Engineering",
      logo_path: "JNTU_Hyderabad_logo.png",
      alt_name: "JNTU Hyderabad",
      duration: "2011 - 2015",
      descriptions: [
        "⚡ I was introduced to some exciting ideas in image processing, signal processing, and stochastic processes (to name a few).",
        "⚡ My interest in image processing led me to subsequently pursue a career in computer vision.",
        "⚡ I attended to several interesting classes, few of them include, Digital Image Processing, Algorithms and Data Structures, Probability theory, Applied Statistics, Engineering Mathematics, Signals and Systems",
      ],
      website_link: "https://jntuh.ac.in/",
    },
  ],
};

const certifications = {
  certifications: [
    {
      title: "TensorFlow Developer Certificate",
      subtitle: "- by Google",
      logo_path: "tf_logo.png",
      certificate_link: "https://scq.io/S5wZu5v",
      alt_name: "TensorFlow Developer Certificate",
      color_code: "#FFBB0099",
    },
    {
      title: "AWS Certified Cloud Practitioner",
      subtitle: "- by Amazon",
      logo_path: "aws_logo.png",
      certificate_link:
        "https://www.credly.com/badges/e49848b7-f76d-436e-adbc-9e465e17d1a1?source=linked_in_profile",
      alt_name: "aws_cloud_native_associate",
      color_code: "#00000099",
    },
    {
      title: "Kubernetes Cloud Native Associate",
      subtitle: "by Google",
      logo_path: "google_logo.png",
      certificate_link:
        "https://www.coursera.org/account/accomplishments/specialization/EB4VJARK8647",
      alt_name: "Google",
      color_code: "#0C9D5899",
    },
  ],
};

// Experience Page
const experience = {
  title: "Experience",
  subtitle: "Past roles in industry as FTE and Intern",
  description: "",
  header_image_path: "experience.svg",
  sections: [
    {
      title: "Research Experience",
      experiences: [
        {
          title: "Research Engineer",
          company: "Mayachitra Inc",
          company_url: "https://mayachitra.com/",
          logo_path: "mc_logo.png",
          duration: "December 2019 - PRESENT",
          location: "Santa Barbara, California",
          description: [
            "⚡ Project 1 – Signal Processing based Malware Detection: Every malware or benign file is set of bytes, which can be translated into images and audio files. Performed computer-vision based analysis on malware images to detect if a given binary is malware or not. Developed fast, lightweight, and 95% accurate framework for malware classification. Demo version is hosted as a webapp at https://malsee.mayachitra.com/.",
            "⚡ Project 2 – Seam-carving based image manipulation detection: Worked on a research project to detect seam carving based manipulations in aerial imagery. Developed deep learning models that are 99.2% accurate at detecting seam carved images. Enhanced forensic models to come up with a localized segmentation masks to predict the regions of the image that are manipulated besides image level binary prediction (Preliminary results are published to MDCWC Conference).",
            "⚡ Project 3 – GAN based Object Removal and Insertion: Developed a novel GAN based image manipulation framework that uses few shot learning techniques to insert / remove objects in aerial or consumer imagery by using the semantic information of the objects present in the image.",
            "⚡ Project 4 – Date Metadata Tampering on Satellite Imagery: Worked towards the development of computer vision models to predict sun angle by utilizing satellite image pixel information and its lat long information. Image capture date is calculated using azimuth and elevation angles of sun that are predicted with 5.1 degrees of variance.",
            "⚡ Project 5 – RPC Metadata Authenticator: Developed physics-based models that are 99.98% accurate at authenticating the RPC metadata that was claimed to be used for orthorectifying a satellite image. Authentication has been carried out by matching the DFT patterns of pixel displacements (Writing paper to IEEE Journal – Transactions on Information Forensics and Security– Work in progress). ",
            "⚡ Project 6 – Deepfake Detection: Worked towards the development of co-occurrence matrix-based image manipulation detectors that are 98.4% accurate in detecting if the image is generated by GAN. Demo version is hosted as a webapp at https://medifor-webapp-mayachitra.azurewebsites.net/.",
          ],
          color: "#0879bf",
        },
        {
          title: "Research Intern",
          company: "National Renewable Energy Laboratory",
          company_url: "https://www.nrel.gov/",
          logo_path: "nrel_logo.png",
          duration: "March 2019 - December 2019",
          location: "Denver, Colorado",
          description: [
            "⚡ Project 1 – Image segmentation model for receiver edge detection: Developed a semantic segmentation model with a modified SegNet architecture to detect the reflection of the solar tower on heliostats. Shape of the receiver’s reflection on the heliostat is used for picking defective facets. SegNet Accuracy: 92.14%",
            "⚡ Project 2 – Anomaly Detection in Feedstock stream: Developed a GRU network based time series classification model to detect if the input feedstock stream can overload the reactor and lead to unnecessary shutdown. Publication Link: https://rdcu.be/caZd9",
          ],
          color: "#9b1578",
        },
        {
          title: "Research Assistant",
          company: "University of Colorado Denver",
          company_url: "https://www.ucdenver.edu/",
          logo_path: "ucd.png",
          duration: "March 2019 - December 2019",
          location: "Denver, Colorado",
          description: [
            "⚡ Project 1 - Handgun Detection: Worked with Prof. Dan Connors to implement a handgun detection model using YOLO neural network and R-CNN. Obtained Model mAp: 81.2.",
            "⚡ Project 2 - Car Logo Detector: Developed 92% accurate car logo detector that can analyze the video stream from street cameras and generate a daily statistical report on customer usage of each car brand.",
          ],
          color: "#9b1578",
        },
      ],
    },
    {
      title: "Software Engineering Experience",
      experiences: [
        {
          title: "Software Engineer",
          company: "Netcracker Technologies",
          company_url: "https://www.linkedin.com/company/freecopy/about/",
          logo_path: "nc_logo.png",
          duration: "June 2015 - July 2017",
          location: "Hyderabad, India",
          description: [
            "⚡ Worked for 2 years as C++ and Python developer of telecom billing applications (ICOMS, RB).",
            "⚡ Gained expertise in dealing with software development, interactive/batch debugging, and unit testing.",
            "⚡ Worked in all phases of software development life cycle while working on enhancements of ICOMS.",
            "⚡ Worked towards the development of REST APIs to streamline customer payments and adjustment that are compliant to PCI standards.",
          ],
          color: "#fc1f20",
        },
      ],
    },
  ],
};

// Projects Page
const projectsHeader = {
  title: "Publications",
  description:
    "My projects makes use of vast variety of latest technology tools. My best experience is to create Data Science projects and deploy them to web applications using cloud infrastructure.",
  avatar_image_path: "projects_image.svg",
};

const publicationsHeader = {
  title: "Publications",
  description:
    "I have worked on and published a few research papers and publications of my own.",
  avatar_image_path: "projects_image.svg",
};

// Contact Page
const contactPageData = {
  contactSection: {
    title: "Contact Me",
    profile_image_path: "ck_contact_me.png",
    description:
      // "I am available on almost every social media. You can message me, I will reply within 24 hours. I can help you with ML, AI, React, Android, Cloud and Opensource Development.",
      "I love to talk. I believe many research ideas originate from impromptu discussions with my fellow engineers. You can text me or email me. I should get back to you by the end of coming weekend.",
  },
  blogSection: {
    title: "Blogs",
    subtitle:
      "For individual fundamental empowerment, I like to write powerful lessons that create impact on each of the reader individually to change the core of their character.",
    link: "https://ashutoshhathidara.wordpress.com",
    avatar_image_path: "blogs_image.svg",
  },
  addressSection: {
    title: "Address",
    subtitle: "Santa Barbara, California. 93111",
    avatar_image_path: "address_image.svg",
    location_map_link: "https://goo.gl/maps/FPAStyc8Ruf98v2Z8",
  },
  phoneSection: {
    title: "Phone Number",
    subtitle: "+1 (720) 372-9135",
  },
};

export {
  settings,
  seo,
  greeting,
  socialMediaLinks,
  skills,
  competitiveSites,
  degrees,
  certifications,
  experience,
  projectsHeader,
  publicationsHeader,
  contactPageData,
};

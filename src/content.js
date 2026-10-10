export const sections = [
  { id: "work", label: "work" },
  { id: "experience", label: "experience" },
  { id: "publications", label: "publications" },
  { id: "contact", label: "contact" },
];

export const profile = {
  name: "Chandrakanth Gudavalli",
  tagline: "3D reconstruction · SfM · Gaussian Splatting · Diffusion Models",
  bio: "I build 3D reconstruction systems that hold up on messy, real-world imagery — from Structure-from-Motion and camera pose estimation to Gaussian Splatting, at campus and city scale.",
  links: {
    resume: "/resume.pdf",
    linkedin: "https://www.linkedin.com/in/gudavallic",
    scholar: "https://scholar.google.com/citations?user=TyzK9okAAAAJ",
    email: "mailto:chandrakanthgudavalli@gmail.com",
  },
  highlight: {
    text: "#1 · IARPA WRIVA Cross-View Geo-Localization Challenge 2026",
    label: "certificate",
    href: "/media/wriva-cvgl-certificate.jpg",
  },
};

export const hero = {
  caption: "images → SfM cameras → dense reconstruction",
  subject: "JHU campus · IARPA WRIVA",
  panes: [
    {
      label: "1 · recovered camera poses",
      video: { webm: "/media/hero-poses.webm", mp4: "/media/hero-poses.mp4" },
      poster: "/media/hero-poses.jpg",
    },
    {
      label: "2 · dense 3D model",
      video: { webm: "/media/hero-dense.webm", mp4: "/media/hero-dense.mp4" },
      poster: "/media/hero-dense.jpg",
    },
  ],
};

export const work = [
  {
    title: "Cloud-native SfM for IARPA WRIVA",
    impact:
      "Wide-baseline, mixed-altitude imagery fused with GPS, OpenStreetMap and satellite priors. Ranked #1 on the WRIVA leaderboard, ahead of teams from MIT and Stanford.",
    media: {
      image: "/media/wriva.jpg",
      alt: "Dense 3D reconstruction of the JHU campus seen from above",
    },
    links: [{ label: "demo", href: "https://cpeng93.github.io/JHU-in-3D/" }],
  },
  {
    title: "Campus-scale reconstruction from drone footage",
    impact:
      "UCSB campus reconstructed end-to-end from thousands of heterogeneous drone images — ingestion, pose estimation, dense reconstruction and validation.",
    media: {
      image: "/media/campus.jpg",
      alt: "3D reconstruction of the UCSB campus from drone footage",
    },
    links: [
      { label: "demo 1", href: "https://youtu.be/2GJS7BRKg1s" },
      { label: "demo 2", href: "https://youtu.be/LbreY2Czc7E" },
    ],
  },
  {
    title: "Ground → satellite geolocalization via 3DGS",
    impact:
      "Clusters of ground images rendered to a zenith view with Gaussian Splatting and Difix3D, then registered to WorldView-3 imagery. Sub-10 m camera RMSE; ranked #1 in the IARPA WRIVA Cross-View Geo-Localization Challenge 2026 (with Tajuddin Manhar Mohammed).",
    media: {
      image: "/media/geoloc.jpg",
      alt: "Ground images geo-located onto satellite imagery",
    },
    links: [
      { label: "CVPR 2026", href: "https://arxiv.org/abs/2602.14929" },
      { label: "#1 certificate", href: "/media/wriva-cvgl-certificate.jpg" },
    ],
  },
  {
    title: "MetaReg: fast incremental registration",
    impact:
      "Custom PnP that uses noisy GPS and spatial neighbours to add a new camera to an existing reconstruction in under 1.34 s.",
    media: {
      video: { webm: "/media/metareg.webm", mp4: "/media/metareg.mp4" },
      poster: "/media/metareg.jpg",
      alt: "New cameras registering into an aerial point cloud",
    },
    links: [
      {
        label: "ICIP 2025",
        href: "https://drive.google.com/file/d/1pQgsJrdcIrL6Ntq7tu0qqvlFOJ5Z3w9F/view",
      },
    ],
  },
];

export const experience = [
  {
    org: "Mayachitra Inc",
    role: "Research Engineer, 3D Computer Vision",
    location: "Santa Barbara, CA",
    start: "Dec 2019",
    end: "Present",
    bullets: [
      "Productionized a cloud-native SfM pipeline for IARPA WRIVA fusing GPS, OpenStreetMap and satellite priors — #1 on the program leaderboard.",
      "Built ground-to-satellite geolocalization with Gaussian Splatting and Difix3D: sub-10 m camera RMSE (CVPR 2026), #1 in the IARPA WRIVA CVGL Challenge 2026.",
      "Benchmarked feed-forward pose models (VGGT, Pi3) against COLMAP and GLOMAP; recovered reliable poses from as few as 2–5 images.",
    ],
  },
  {
    org: "Vision Research Lab, UCSB",
    role: "Visiting Research Staff, ML Ops & 3D Vision",
    location: "Santa Barbara, CA",
    start: "Jun 2022",
    end: "Present",
    bullets: [
      "Led campus-scale 3D reconstruction from sparse, heterogeneous imagery, scaling to thousands of images.",
      "Technical lead for a 14-member cross-institution collaboration with Johns Hopkins University.",
      "Moved the BisQue 3D platform onto Kubernetes and Argo, with GPU-backed services and web viewers for point clouds and Gaussian splats.",
    ],
  },
  {
    org: "National Renewable Energy Laboratory",
    role: "Graduate Intern, Computer Vision",
    location: "Denver, CO",
    start: "Mar 2019",
    end: "Dec 2019",
    compact: true,
    bullets: [
      "Segmentation for heliostat defect detection and GRU-based anomaly detection in bio-feedstock streams.",
    ],
  },
  {
    org: "Netcracker Technologies",
    role: "Software Engineer",
    location: "Hyderabad, India",
    start: "Jun 2015",
    end: "Jul 2017",
    compact: true,
    bullets: [
      "C++ and Python developer on telecom billing systems and PCI-compliant payment APIs.",
    ],
  },
];

export const publications = [
  {
    year: 2026,
    type: "paper",
    title:
      "Wrivinder: Towards Spatial Intelligence for Geo-locating Ground Images onto Satellite Imagery",
    authors: "C. Gudavalli et al.",
    venue: "CVPR 2026",
    href: "https://arxiv.org/abs/2602.14929",
  },
  {
    year: 2025,
    type: "paper",
    title:
      "METAREG: Robust Camera Parameter Estimation by Leveraging Noisy Camera Extrinsics",
    authors: "C. Gudavalli et al.",
    venue: "IEEE ICIP 2025",
    href: "https://drive.google.com/file/d/1pQgsJrdcIrL6Ntq7tu0qqvlFOJ5Z3w9F/view",
  },
  {
    year: 2025,
    type: "paper",
    title:
      "CIMGEN: Controlled Satellite Image Manipulation by Fine-Tuning Pretrained Generative Models on Limited Data",
    authors:
      "C. Gudavalli, E. Rosten, L. Nataraj, S. Chandrasekaran, B. S. Manjunath",
    venue: "ICPR (Springer)",
    href: "https://link.springer.com/chapter/10.1007/978-3-031-78305-0_7",
  },
  {
    year: 2024,
    type: "paper",
    title:
      "Q-RBSA: High-Resolution 3D EBSD Map Generation Using an Efficient Quaternion Transformer Network",
    authors:
      "D. K. Jangid, N. R. Brodnik, M. P. Echlin, C. Gudavalli, C. Levenson, T. M. Pollock, S. H. Daly, B. S. Manjunath",
    venue: "npj Computational Materials",
    href: "https://doi.org/10.1038/s41524-024-01209-6",
  },
  {
    year: 2023,
    type: "paper",
    title:
      "Resampling Estimation Based RPC Metadata Verification in Satellite Imagery",
    authors:
      "C. Gudavalli, M. Goebel, T. Nanjundaswamy, L. Nataraj, S. Chandrasekaran, B. S. Manjunath",
    venue: "IEEE Transactions on Information Forensics and Security",
    href: "https://ieeexplore.ieee.org/abstract/document/10124789",
  },
  {
    year: 2023,
    type: "patent",
    title: "Rational Polynomial Coefficient Based Metadata Verification",
    authors:
      "C. Gudavalli, M. Goebel, T. Nanjundaswamy, L. Nataraj, S. Chandrasekaran, B. S. Manjunath",
    venue: "US 11,842,471 B2",
    href: "https://patents.google.com/patent/US11842471B2/en",
  },
  {
    year: 2023,
    type: "patent",
    title: "Controlled Image Manipulations Using Semantic Labels",
    authors: "C. Gudavalli et al.",
    venue: "US 2023/0419655 A1",
    href: "https://patents.google.com/patent/US20230419655A1/en",
  },
  {
    year: 2022,
    type: "paper",
    title:
      "SeeTheSeams: Localized Detection of Seam Carving Based Image Forgery in Satellite Imagery",
    authors:
      "C. Gudavalli, E. Rosten, L. Nataraj, S. Chandrasekaran, B. S. Manjunath",
    venue: "CVPR 2022 Workshop on Media Forensics",
    href: "https://doi.org/10.1109/cvprw56347.2022.00010",
  },
  {
    year: 2021,
    type: "paper",
    title:
      "Seam Carving Detection and Localization Using Two-Stage Deep Neural Networks",
    authors:
      "L. Nataraj, C. Gudavalli, T. M. Mohammed, S. Chandrasekaran, B. S. Manjunath",
    venue:
      "Machine Learning, Deep Learning and Computational Intelligence for Wireless Communication (Springer)",
    href: "https://doi.org/10.1007/978-981-16-0289-4_29",
  },
  {
    year: 2020,
    type: "paper",
    title:
      "Real-Time Biomass Feedstock Particle Quality Detection Using Image Analysis and Machine Vision",
    authors: "C. Gudavalli, E. Bose, B. S. Donohoe, D. A. Sievers",
    venue: "Biomass Conversion and Biorefinery",
    href: "https://rdcu.be/caZd9",
  },
];

export const education = [
  {
    degree: "M.S. Electrical & Computer Engineering",
    school: "University of Colorado Denver",
    year: "2019",
  },
  {
    degree: "B.Tech Electronics & Communication Engineering",
    school: "JNTU Hyderabad",
    year: "2015",
  },
];

export const contact = {
  blurb:
    "Open to 3D vision and spatial-AI roles. The fastest way to reach me is email.",
  email: "mailto:chandrakanthgudavalli@gmail.com",
  linkedin: "https://www.linkedin.com/in/gudavallic",
};

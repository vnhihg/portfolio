/*
  YOUR CONTENT – edit this file, nothing else.
  Keep the quotes and commas. Save, then upload the file to GitHub again.
  Type | in a headline where you want the line to break.
*/
window.PORTFOLIO = {
  siteTitle: "Nhi Hoang – Portfolio",

  /* ---- Top of the page ---- */
  name: "Nhi Hoàng",                 // first and last name go on two lines
  role: "Artist / Illustrator",
  notes: [                           // the three handwritten notes
    "Hi. Since you're new here,",
    "let me be your guide.",
    "This is"
  ],
  heroImage: "images/hero_image.png",                     // e.g. "images/me.png"  (a cut-out PNG looks best; leave "" for none)

  /* ---- Spinning flowers in the hero (they sit behind the photo and the name) ----
     left / top = where the flower's top-left corner sits, as % of the hero
     size       = width as % of the hero
     spin       = seconds per full turn (bigger = slower); negative number = spins the other way */
  heroFlowers: [
    { image: "images/flowerblue.png",   left: "62%", top: "1%",  size: "26%", spin: 22 },
    { image: "images/floweryellow.png", left: "6%",  top: "50%", size: "24%", spin: -28 }
  ],

  /* ---- About ---- */
  aboutHeadline: "it's not just art, | it's vibing with colour.",
  aboutText: [
    "Hi, I'm Nhi. I make art and illustrations that are colourful, playful, and a little cheeky. I love to blend codes and colors to create a unique visuals. My work is inspired by everyday life, pop culture, and the beauty of imperfection.",
    "This is my portfolio scrapbook. Here you'll find a selection of my work, from personal projects to commissions."
  ],
  aboutList: ["Illustration", "Painting", "Commissions", "Websites (from scratch or with various CMS)"],
  aboutImage: "images/body_img.jpg",
  handle: "@vannni.h",
  instagram: "https://www.instagram.com/vannni.h/",                     

  /* ---- My story ----
     Two chapters. Each has a text, two photos of you (put the files in the "images" folder),
     and a short bold closing line. */
  storyHeading: "my story",
  story: [
    {
      text: "I was born and raised in Hanoi, I have always been fascinated by the world of art and design. My journey has been a continuous exploration of my own style and voice.",
      photos: [
        { image: "images/story_1a.jpg", label: "im Bau :)" },
        { image: "images/story_1b.jpg", label: "im Bau" }
      ],
      highlight: "I'm always looking for new ways to express myself and connect with others through my art."
    },
    {
      text: "As I grew older, I realized what fun it is to create art that works with digital media as well. I learned to use various software and tools to bring my ideas to life, and I started to experiment with different styles and techniques.",
      photos: [
        { image: "images/story_2a.jpg", label: "Under Construction" },
        { image: "images/story_2b.jpg", label: "Under Construction" }
      ],
      highlight: "I'm always excited to take on new challenges and push the boundaries of my creativity."
    }
  ],

  /* ---- Resume ---- */
  resumeHeading: "resume",
  resumeNote: "Want the full picture? Here is my CV.",
  resumeLink: "files/Lebenslauf_Hoang.pdf",        
  resumeButton: "Open my CV (PDF)",

  /* ---- Contact ---- */
  email: "vn.hoang@gmx.de",
  contactHeading: "and that's | a wrap.",
  contactNote: "Thank you so much for taking the time to look through my portfolio. If you'd like to work together, I'd love to chat.",

  /* ---- Colour ---- */
  accent: "#f08cbf",

  /* ---- Your artwork ----
     1. Put the image files in the "images" folder
     2. Add one line per piece below (newest or favourite first)
     Tip: JPG or WebP, around 1600 px on the long side, under 500 KB each, keeps the page fast. */
  works: [
     { image: "images/DU_farm_pos.png", title: "Famer's Market", detail: "Mock-up poster" },
     { image: "images/Museum_pos.png",   title: "Von Kopf bis Pfote",   detail: "Mock-up flyer for an exhibition " },
     { image: "images/lgbt_pos.png",   title: "Same sex marriage",   detail: "Instagram post for ISEE on LGBT marriage acceptance survey" },
     { image: "images/girlsday_pos.png",   title: "Girls in science",   detail: "Mock-up Instagram post for an event" },
     { image: "images/pigeon_pos.png",   title: "Percival the Pigeon",   detail: "Character design for an Audiobook project" },
    { image: "images/cologne_illust.png",   title: "Köln",   detail: "Hand-drawn illustration of Cologne" },
  ]
};
import type { WebsitesData } from "~/types";

const websites: WebsitesData = {
  favorites: {
    title: "SNS Links",
    sites: [
      {
        id: "my-email",
        title: "Email",
        img: "img/sites/gmail.svg",
        link: "mailto:senyuvaj997@gmail.com",
      },
      {
        id: "my-github",
        title: "Github",
        img: "img/sites/github.svg",
        link: "https://github.com/yuvrajsen-cloud",
      },
      {
        id: "my-linkedin",
        title: "Linkedin",
        img: "img/sites/linkedin.svg",
        link: "https://www.linkedin.com/in/yuvraj-sen-772434334",
      },
      {
        id: "leetcode",
        title: "LeetCode",
        img: "img/sites/leetcode.svg",
        link: "https://leetcode.com/u/yuvraj_sen/",
      },
      {
        id: "GeeksforGeeks",
        title: "GeeksforGeeks",
        img: "img/sites/gfg.png",
        link: "https://www.geeksforgeeks.org/user/demaxxer/",
      },
    ],
  },
  freq: {
    title: "Frequently Visited",
    sites: [
      {
        id: "hacker-news",
        title: "Hacker News",
        img: "img/sites/hacker.svg",
        link: "https://news.ycombinator.com/",
      },
      {
        id: "github",
        title: "Github",
        img: "img/sites/github.svg",
        link: "https://github.com/",
      },
      {
        id: "twitter",
        title: "Twitter",
        img: "img/sites/twitter.svg",
        link: "https://www.twitter.com/",
      },
      {
        id: "leetcode",
        title: "LeetCode",
        img: "img/sites/leetcode.svg",
        link: "https://leetcode.com/",
      },
      {
        id: "GeeksforGeeks",
        title: "GeeksforGeeks",
        img: "img/sites/gfg.png",
        link: "https://www.geeksforgeeks.org/",
      },
    ],
  },
};

export default websites;

import deadlineDawn from "./assets/menu/deadline-dawn.jpg";
import campusBlackout from "./assets/menu/campus-blackout.jpg";
import posterSession from "./assets/menu/poster-session.jpg";
import reviewerNightmare from "./assets/menu/reviewer-nightmare.jpg";
import reviewerTribunal from "./assets/menu/reviewer-tribunal.jpg";
import revisionNight from "./assets/menu/revision-night.jpg";
import submissionSunrise from "./assets/menu/submission-sunrise.jpg";

export const MENU_ILLUSTRATIONS = [
  {
    id: "revision-night",
    src: revisionNight,
    kicker: "02:17 · REVISION NIGHT",
    title: "灯还亮着，Reviewer #2 也一样。",
    titleEn: "The light is still on. So is Reviewer #2.",
    caption: "雨落在窗上，第十四次实验正在学习如何失败得更有统计意义。",
    captionEn: "Rain traces the window while experiment fourteen learns to fail with statistical significance.",
  },
  {
    id: "deadline-dawn",
    src: deadlineDawn,
    kicker: "05:48 · DEADLINE DAWN",
    title: "太阳升起，截止日期没有退后。",
    titleEn: "The sun rises. The deadline does not move.",
    caption: "城市醒来时，你正在决定 final_v12_really_final 是否足以代表诚意。",
    captionEn: "As the city wakes, you decide whether final_v12_really_final is a sincere filename.",
  },
  {
    id: "reviewer-nightmare",
    src: reviewerNightmare,
    kicker: "03:06 · RESPONSE LETTER",
    title: "一条小意见，长成了补充材料。",
    titleEn: "One minor comment becomes a supplement.",
    caption: "打印机仍在工作。你开始怀疑它和审稿人之间存在未披露的利益关系。",
    captionEn: "The printer keeps working. You suspect an undisclosed conflict of interest with the reviewer.",
  },
  {
    id: "campus-blackout",
    src: campusBlackout,
    kicker: "01:43 · CAMPUS BLACKOUT",
    title: "整栋楼停电，只剩审稿意见亮着。",
    titleEn: "The building goes dark. The comments remain illuminated.",
    caption: "你抱着电脑穿过雨夜，去寻找全校最后一个仍在呼吸的插座。",
    captionEn: "You carry the laptop through the rain toward the last outlet on campus that still appears alive.",
  },
  {
    id: "reviewer-tribunal",
    src: reviewerTribunal,
    kicker: "09:00 · EDITORIAL HEARING",
    title: "匿名评审入席。答辩人没有匿名。",
    titleEn: "The anonymous reviewer takes a seat. You do not get anonymity.",
    caption: "你准备了四十七页回复信，对方准备了一个名为“小问题”的问题。",
    captionEn: "You bring forty-seven pages of rebuttal. They bring one question described as minor.",
  },
  {
    id: "poster-session",
    src: posterSession,
    kicker: "16:20 · POSTER HALL",
    title: "有人停下来，认真读了你的图。",
    titleEn: "Someone stops and actually reads your figure.",
    caption: "历经四轮修改后，那条误差棒终于换来一个真实的问题，而不是另一条审稿意见。",
    captionEn: "After four revisions, the error bar earns a real question instead of another reviewer comment.",
  },
  {
    id: "submission-sunrise",
    src: submissionSunrise,
    kicker: "07:12 · CAMERA READY",
    title: "办公室终于安静了一会儿。",
    titleEn: "For a moment, the office is finally quiet.",
    caption: "服务器灯稳定地闪着。咖啡凉了。某处，一个新审稿人刚打开 PDF。",
    captionEn: "Server lights blink steadily. Coffee cools. Somewhere, a new reviewer opens the PDF.",
  },
] as const;

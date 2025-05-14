function newTabLinks() {
  document.querySelectorAll("a").forEach((link) => {
    link.setAttribute("target", "_blank");
  });
}

function pagination() {
  const resume = document.querySelector(".resume");
  const personalInfo = resume.querySelector(".personal-info");
  const storedPersonalInfo = personalInfo ? personalInfo.cloneNode(true) : null;
  const sectionsContainer = resume.querySelector(".sections");
  const sectionElements = sectionsContainer
    ? sectionsContainer.querySelectorAll(".section")
    : [];
  const storedSections = Array.from(sectionElements).map((section) =>
    section.cloneNode(true)
  );
  resume.remove();
  let isFirstResume = true;
  let currentResume = null;
  let currentSections = null;
  function createResume(includePersonalInfo) {
    const resume = document.createElement("div");
    resume.className = "resume";

    const sections = document.createElement("div");
    sections.className = "sections";

    if (includePersonalInfo && storedPersonalInfo) {
      resume.appendChild(storedPersonalInfo.cloneNode(true));
    }

    resume.appendChild(sections);
    document.body.appendChild(resume);

    return { resume, sections };
  }
  function isSectionsOverflowing(resume, sections) {
    const resumeRect = resume.getBoundingClientRect();
    const sectionsRect = sections.getBoundingClientRect();
    return sectionsRect.bottom > resumeRect.bottom;
  }
  storedSections.forEach((section) => {
    const sectionClone = section.cloneNode(true);
    if (!currentResume) {
      const created = createResume(isFirstResume);
      currentResume = created.resume;
      currentSections = created.sections;
      isFirstResume = false;
    }
    currentSections.appendChild(sectionClone);
    if (isSectionsOverflowing(currentResume, currentSections)) {
      currentSections.removeChild(sectionClone);

      const created = createResume(false);
      currentResume = created.resume;
      currentSections = created.sections;

      currentSections.appendChild(sectionClone);
    }
  });
  const allSections = document.querySelectorAll(".sections");
  allSections.forEach((sections, index) => {
    if (index !== 0) {
      sections.style.justifyContent = "start";
      sections.style.marginTop = "5vw";
    }
  });
  const resumes = document.querySelectorAll("body > .resume");
  const resumeCount = resumes.length;
  if (resumeCount > 1) {
    resumes.forEach((resume, index) => {
      const pageCount = document.createElement("p");
      pageCount.className = "page-count";
      pageCount.textContent = `Page ${index + 1} of ${resumeCount}`;
      resume.appendChild(pageCount);
    });
  }
}
newTabLinks();
const sectionsCheck = document
  .querySelector(".sections")
  .getBoundingClientRect().bottom;
const resumeCheck = document
  .querySelector(".resume")
  .getBoundingClientRect().bottom;
if (sectionsCheck > resumeCheck) {
  pagination();
}

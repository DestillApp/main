export const scrollToTop = (): void => {
  window.scrollTo(0, 0);
};

export const plantAgeWithSuffix = (age: number): string => {
  if (age === 1) {
    return "miesiąc";
  } else if (
    (age > 1 && age < 5) ||
    (age % 10 >= 2 && age % 10 <= 4 && !(age >= 12 && age <= 14)) ||
    (age % 10 === 3 && age !== 13)
  ) {
    return "miesiące";
  } else {
    return "miesięcy";
  }
};

const collection = response => {
  const steps = response.steps || response;
  return Object.keys(steps)
    .map(id => steps[id])
    .filter(step => step.embedType && step.embedType === 'song')
    .map(step => Object.assign({}, step, extendLinks(step.path)))
    .sort((a, b) => a.start - b.start);
};

const withinBoundaries = date => {
  return step => (
    new Date(step.start * 1000).getTime() <= date.getTime() &&
    new Date(step.end * 1000).getTime() > date.getTime()
  );
};

export default class Steps {
  static getAll(response) {
    return collection(response);
  }

  static atTime(response, timestampOrDate) {
    const date = Number.isFinite(timestampOrDate)
      ? new Date(timestampOrDate * 1000)
      : new Date(timestampOrDate);

    return collection(response).find(withinBoundaries(date));
  }

  static getCurrent(response) {
    return this.atTime(response, new Date());
  }
}

export function extendLinks (path) {
  if (typeof path !== 'string') {
    return {};
  }

  if (/itunes.apple.com/.test(path)) {
    return {lienItunes: path};
  }

  if (/amazon./.test(path)) {
    return {lienAmazon: path};
  }

  return {};
}

export function isBefore (step, date = new Date()) {
  return new Date(step.end * 1000).getTime() < date.getTime();
}

export function isCurrent (step, date = new Date()) {
  return withinBoundaries(date)(step);
}

export function isAfter (step, date = new Date()) {
  return new Date(step.start * 1000).getTime() > date.getTime();
}

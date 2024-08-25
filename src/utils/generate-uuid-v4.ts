export function generateUUIDv4(): string {
  function randomHexSegment(): string {
    return ((Math.random() * 0xffff) | 0).toString(16).padStart(4, "0");
  }

  return (
    randomHexSegment() +
    randomHexSegment() +
    "-" +
    randomHexSegment() +
    "-" +
    ((Math.random() * 0x0fff) | 0x4000).toString(16) +
    "-" +
    ((Math.random() * 0x3fff) | 0x8000).toString(16) +
    "-" +
    randomHexSegment() +
    randomHexSegment() +
    randomHexSegment()
  );
}

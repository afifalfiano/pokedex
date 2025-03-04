export const removeDuplicate = (arr: any[], key: string): any[] => {
  return [...new Map(arr.map(item => [item[key], item])).values()];
}

// Function to try and find a value in given property by id
export function getMetaItemNameValue(propertyName: string, id: number): string {
    const prop = this[propertyName].find((t) => t.Id === id);
    return prop ? prop.Name : '';
}

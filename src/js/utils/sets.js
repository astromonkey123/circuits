function isSubset(array1, array2) {
    for (const element of array2) {
        if (!array1.includes(element)) {
            return false;
        }
    }
    return true;
}

function isEqual(array1, array2) {
    if (isSubset(array1, array2) && isSubset(array2, array1)) {
        return true;
    }
    return false;
}

export { isEqual };
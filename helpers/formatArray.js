export function removeDuplicates(arr = [], keys) {
    const unique = {}
    const result = []
    if (!Array.isArray(arr)) {
        console.log('Not an array')
    } else
        arr?.forEach((item) => {
            const key = keys.map((k) => item[k]).join('|')
            if (!unique[key]) {
                unique[key] = true
                result.push(item)
            }
        })

    return result
}

export function getRandomElementFromArray(arr) {
    if (arr.length > 0) {
        const randomIndex = Math.floor(Math.random() * arr.length)
        return arr[randomIndex]
    }
    return
}

export function toggleArrayElement(array, element) {
    const index = array.indexOf(element)
    if (index === -1) {
        // Element doesn't exist in array, so add it
        array.push(element)
    } else {
        // Element exists in array, so remove it
        array.splice(index, 1)
    }
    return array
}

export const flattenedArray = (originalArray) => {
    return originalArray.reduce((acc, innerArray) => {
        return [...acc, ...innerArray]
    }, [])
}

export function getPropertyArray(array, property) {
    return array.map(function (obj) {
        return obj[property]
    })
}

export function isSubstringInArray(substring, stringArray) {
    const upperCaseSubstring = substring.toUpperCase()
    for (let i = 0; i < stringArray.length; i++) {
        const upperCaseString = stringArray[i].toUpperCase()
        if (upperCaseString.includes(upperCaseSubstring)) {
            return true
        }
    }
    return false
}

export function sortAscending(arr) {
    return [...arr]?.sort((a, b) => a.localeCompare(b))
}

export const sortedDataByCreatedAt = (data) =>
    [...data]?.sort((a, b) => {
        return new Date(a.created_at) - new Date(b.created_at)
    })

export function sortByProperty(array, property, order = 'asc') {
    const sortOrder = order === 'desc' ? -1 : 1
    if (array.length == 0) {
        return array
    } else {
        return [...array]?.sort((a, b) => {
            const aValue = a[property]
            const bValue = b[property]
            if (aValue < bValue) {
                return -1 * sortOrder
            }
            if (aValue > bValue) {
                return 1 * sortOrder
            }
            return 0
        })
    }
}

export function generateNaturalNumbers(start, end) {
    let result = []
    for (let i = start; i <= end; i++) {
        result.push(i)
    }
    return result
}

export function updateObjects(arr, condition, propName, propValue) {
    let newArr = []
    for (let i = 0; i < arr.length; i++) {
        if (condition(arr[i])) {
            let newObj = { ...arr[i], [propName]: propValue }
            newArr.push(newObj)
        } else {
            newArr.push(arr[i])
        }
    }
    return newArr
}

export function getAdjacentObject(
    array,
    currentPropValue,
    propName,
    direction
) {
    const currentIndex = array.findIndex(
        (obj) => obj[propName] === currentPropValue
    )
    const adjacentIndex =
        direction === 'next' ? currentIndex + 1 : currentIndex - 1
    return array[adjacentIndex] || null
}

export function isLastObjectByProperty(arr, obj, prop) {
    const lastIndex = arr.length - 1
    const lastElement = arr[lastIndex]
    return lastElement[prop] === obj[prop]
}

export function getFilenames(fileList) {
    let filenames = []
    for (let i = 0; i < fileList.length; i++) {
        filenames.push(fileList[i].name)
    }
    return filenames
}

export function extractPropsByInputArray(arr, inPropArr, inProp, outProp) {
    const extProps = []
    for (const obj of arr) {
        if (inPropArr?.includes(obj[inProp])) {
            extProps?.push(obj[outProp])
        }
    }
    return extProps
}

export function areFileListsEqual(fileList1, fileList2) {
    if (fileList1?.length !== fileList2?.length) {
        return false
    }

    for (let i = 0; i < fileList1?.length; i++) {
        const file1 = fileList1?.item(i)
        let found = false
        for (let j = 0; j < fileList2?.length; j++) {
            const file2 = fileList2?.item(j)
            if (file1?.name === file2?.name && file1?.size === file2?.size) {
                found = true
                break
            }
        }
        if (!found) {
            return false
        }
    }

    return true
}

export function sortByTagName(array) {
    return [...array].sort((a, b) => {
        const tagA = a?.tags[0]?.name?.toUpperCase()
        const tagB = b?.tags[0]?.name?.toUpperCase()

        if (tagA < tagB) {
            return -1
        }
        if (tagA > tagB) {
            return 1
        }

        return 0
    })

    return array
}

export function removeDuplicatesByKey(arr, key) {
    return arr.filter(
        (obj, index, self) =>
            index === self.findIndex((o) => o[key] === obj[key])
    )
}

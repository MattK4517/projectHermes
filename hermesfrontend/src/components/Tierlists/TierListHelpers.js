

export function compareNumericString(rowA, rowB, id, desc) {
    let a = Number.parseFloat(rowA.values[id]);
    let b = Number.parseFloat(rowB.values[id]);
    if (Number.isNaN(a)) {  // Blanks and non-numeric strings to bottom
        a = desc ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
    }
    if (Number.isNaN(b)) {
        b = desc ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
    }
    if (a > b) return 1; 
    if (a < b) return -1;
    return 0;
  }

  export function compareTier(rowA, rowB, id, desc) {
      let a = rowA.values[id]
      let B = rowB.values[id]
  }
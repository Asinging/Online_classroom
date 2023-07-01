/*eslint-disable*/
//  function to format number with comma (,) separation

export function formattedInputValue(x) {
   // ;
   if (!x) return parseFloat('0');
   if (typeof x !== 'string') return x;
   let inputValue = x.split(',');
   return parseFloat(inputValue.join(''));
}

export function countFromOne(x) {
   if (x) {
      return x
         .map((item, index) => {
            if (!item) return false;
            item.count = index + 1;
            return item;
         })
         .filter(Boolean);
   }
   return [];
}

export function paginateCounteFromOne(val) {
   let data = val.data;
   let currentPage = val.currentPage != 1 ? val.currentPage : 0;
   let perPage = val.perPage;

   if (data) {
      return data
         .map((item, index) => {
            if (!item) return false;
            item.count = (currentPage * perPage > 0 ? perPage : 0) + index + 1;

            return item;
         })
         .filter(Boolean);
   }
   return [];
}

// format input value from text-field
export function commaValue(x) {
   let num = parseFloat(x);
   if (num) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
   }
   else return x;
}

//  function for input rules
export function numberInputRules(val) {
   if (!val && val !== 0) return false;
   return [
      val => !!val || 'this field is Required.',
      val => !isNaN(val) || val.match(/^(\d+,)\.*(.)*\d+$/) || 'sorry field is expecting number'
   ];
}
// function for currency formattin
export function numbFormat(nb, region, currencyUsed) {
   if (typeof nb == String && nb.includes(',')) {
      nb = parseFloat(nb.split(',').join(''));
   }
   // let form = new Intl.NumberFormat(region, {
   //   style: 'currency', currency: currencyUsed,
   // }).format(nb)

   // return form

   //
   return parseFloat(nb).toLocaleString(region || 'en-US', {
      style: 'currency',
      currency: currencyUsed || 'USD',
      maximumSignificantDigits: 2
   });
}

// / Generate a number between 0 and 10, including 10
export function generateRandomInteger(max) {
   return Math.floor((Math.random() + 1) * max) * 5;
}
// maximumFractionDigits: 2,
// minimumFractionDigits: 2,

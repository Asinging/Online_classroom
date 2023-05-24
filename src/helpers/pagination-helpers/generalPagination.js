/**
 * paginate the arr submitted
 * @param arr arr  of Record to paginate
 * @param page default page number of the array when paginated
 * @param perPage the number of record to be shown on a page
 */
export function paginate(arr, page, perPage) {
   return arr.slice((page - 1) * perPage, page * perPage);
}

/* eslint-disable prefer-const */
/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable prefer-template */
class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  Filter() {
    const QueryStringObj = { ...this.queryString };
    const excludedFields = ["limit", "page", "sort", "fields", "keyword"];
    excludedFields.forEach((field) => delete QueryStringObj[field]);
    //console.log(this.queryString);
    //console.log(QueryStringObj);

    let queryString = JSON.stringify(QueryStringObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    console.log("new query String  :  " + JSON.parse(queryString));
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryString));
    return this;
  }

  Sort() {
    if (this.queryString.sort) {
      const SortBy = this.queryString.sort.split(",").join(" ");
      console.log(SortBy);
      this.mongooseQuery = this.mongooseQuery.sort(SortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  // limiting fields : to select fields to return in response...........
  limitField() {
    if (this.queryString.fields) {
      const OurFields = this.queryString.fields.split(",").join(" ");
      console.log(OurFields);
      this.mongooseQuery = this.mongooseQuery.select(OurFields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  Search(ModelName) {
    if (this.queryString.keyword) {
      console.log("Search keyword:", this.queryString.keyword);
      let query = {};
      if (ModelName === "Products"){
        query.$or = [
          { title: { $regex: this.queryString.keyword, $options: "i" } },
          { description: { $regex: this.queryString.keyword, $options: "i" } },
        ];
      }else{
        query = { name: { $regex: this.queryString.keyword, $options: "i" } };
      }
      console.log(query);
      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }

  Pagination(countDocuments) {
    const page = this.queryString.page * 1 || 1; // multiply by 1 because it is a string but he want to be integer
    const limit = this.queryString.limit * 1 || 50;
    const skip = (page - 1) * limit;
    const EndIndx = page * limit;

    const paginate = {};
    paginate.currentPage = page;
    paginate.limit = limit;
    paginate.numberOfPages = Math.ceil(countDocuments / limit);

    // next page
    if (EndIndx < countDocuments) {
      paginate.nextPage = page + 1;
    }
    // prev page
    if (skip>0) {
      paginate.prevPage = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.PaginationResult = paginate; 
    return this;
  }
}
module.exports = ApiFeatures;

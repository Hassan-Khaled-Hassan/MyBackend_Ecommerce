const asyncHandler = require("express-async-handler");
const APIError = require("../Utils/apiError");
const ApiFeatures = require("../Utils/ApiFeatures");

exports.deleteOne = (Model,ModelType,ModelTwo = '') => 
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (ModelType === "Category") {
      await ModelTwo.deleteMany({ category: id });
    }
    const Document = await Model.findByIdAndDelete(id);
    if (!Document) {
      return next(
        new APIError(`No ${ModelType} found for this id :  ${id}`, 404)
      );
    }
    res.status(200).send({ message: `${ModelType} deleted Successfully` });
  });


exports.UpdateOne = (Model, ModelType) =>
  asyncHandler(async (req, res, next) => {
    const Document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!Document) {
      return next(
        new APIError(
          `No ${ModelType} found for this id :  ${req.params.id}`,
          404
        )
      );
    }
    Document.save();
    res
      .status(200)
      .json({ message: `${ModelType} Updated Successfully`, data: Document });
  });

exports.CreateOne = (Model) =>
  asyncHandler(async (req, res) => {
    const Document = await Model.create(req.body);
    res.status(201).json({ data: Document });
  });

exports.GetOne = (Model, ModelType , populateOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
     // build query
    let query = Model.findById(id);
    if(populateOpt){
      query = query.populate(populateOpt);
    }
    //execute query
    const Document = await query;
    
    if (!Document) {
      return next(new APIError(`No ${ModelType} found for this id ${id}`, 404));
      // eslint-disable-next-line no-else-return
    } else {
      res.status(200).json({ data: Document });
    }
  });


exports.GetAll = (Model) =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    const countDocuments = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .Pagination(countDocuments)
      .Filter()
      .Search()
      .limitField()
      .Sort();

    const { mongooseQuery, PaginationResult } = apiFeatures;

    const Document = await mongooseQuery;
    res.status(200).json({
      results: Document.length,
      PaginationResult,
      data: Document,
    });
  });
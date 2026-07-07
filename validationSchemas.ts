import Joi from 'joi';

// Document Versioning Validation Schema
export const documentVersioningSchema = Joi.object({
  documentId: Joi.string().required(),
  versionId: Joi.string().optional(),
});

// Track Changes Validation Schema
export const trackChangesSchema = Joi.object({
  documentId: Joi.string().required(),
  changeId: Joi.string().optional(),
});

// Accessibility Validation Schema
export const accessibilitySchema = Joi.object({
  documentId: Joi.string().required(),
});

// Formatting Validation Schema
export const formattingSchema = Joi.object({
  documentId: Joi.string().required(),
  templateId: Joi.string().optional(),
});

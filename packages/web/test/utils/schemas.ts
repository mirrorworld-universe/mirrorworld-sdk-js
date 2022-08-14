import joi from 'joi';

export const collectionSchema = joi.object({
  mint_address: joi.string().required(),
  url: joi.string().required(),
  update_authority: joi.string().required(),
  creator_address: 'GCeY1zY2QFz1iYekbsX1jQjtJnjyxWXtBhxAJPrvG3Bg',
  name: joi.string().required(),
  symbol: joi.string().required(),
  collection: joi.string().optional().allow(null),
  signature: joi.string().required(),
  status: joi.string().required(),
});

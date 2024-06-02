import { Model, DataTypes } from 'sequelize';
import connection from '../connection'

export interface MetaAttributes {
  id?: number;
  description?: string;
  keywords?: string;
  author?: string;
  ogTitle?: string;
  ogType?: string;
  ogImage?: string;
  ogUrl?: string;
  ogDescription?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;

  pageId?: number;

  updatedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
}

class MetaModel extends Model<MetaAttributes> implements MetaAttributes {
  public id!: number;
  public description!: string;
  public keywords!: string;
  public author!: string;
  public ogTitle!: string;
  public ogType!: string;
  public ogImage!: string;
  public ogUrl!: string;
  public ogDescription!: string;
  public twitterCard!: string;
  public twitterTitle!: string;
  public twitterDescription!: string;
  public twitterImage!: string;

  public pageId!: number;

  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;
}

const Meta = MetaModel.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.NUMBER,
    },
    description: {
      type: new DataTypes.STRING(128),
    },
    keywords: {
      type: new DataTypes.STRING(128),
    },
    author: {
      type: new DataTypes.STRING(128),
    },
    ogTitle: {
      type: new DataTypes.STRING(128),
    },
    ogType: {
      type: new DataTypes.STRING(128),
    },
    ogImage: {
      type: new DataTypes.STRING(128),
    },
    ogUrl: {
      type: new DataTypes.STRING(128),
    },
    ogDescription: {
      type: new DataTypes.STRING(128),
    },
    twitterCard: {
      type: new DataTypes.STRING(128),
    },
    twitterTitle: {
      type: new DataTypes.STRING(128),
    },
    twitterDescription: {
      type: new DataTypes.STRING(128),
    },
    twitterImage: {
      type: new DataTypes.STRING(128),
    },

    pageId: {
      allowNull: false,
      type: DataTypes.NUMBER,
    },

    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  },
  {
    sequelize: connection,
    modelName: 'Meta',
  }
);

export default Meta;
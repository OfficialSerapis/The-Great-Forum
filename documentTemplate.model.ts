import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export interface DocumentTemplateAttributes {
  id: number;
  name: string;
  description: string;
  content: string;
  style: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class DocumentTemplate extends Model<DocumentTemplateAttributes> {
  declare id: number;
  declare name: string;
  declare description: string;
  declare content: string;
  declare style: string;
  declare isDefault: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

DocumentTemplate.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  style: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {}
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'DocumentTemplate',
  tableName: 'document_templates'
});

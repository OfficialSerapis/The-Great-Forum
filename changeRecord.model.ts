import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { DocumentInstance } from './document.model';
import { UserInstance } from './user.model';

export interface ChangeRecordAttributes {
  id: number;
  documentId: number;
  userId: number;
  changes: string;
  type: 'edit' | 'format' | 'template' | 'quantum';
  timestamp: Date;
  metadata: any;
  createdAt: Date;
  updatedAt: Date;
}

export class ChangeRecord extends Model<ChangeRecordAttributes> {
  declare id: number;
  declare documentId: number;
  declare userId: number;
  declare changes: string;
  declare type: 'edit' | 'format' | 'template' | 'quantum';
  declare timestamp: Date;
  declare metadata: any;
  declare createdAt: Date;
  declare updatedAt: Date;

  // Associations
  declare document?: DocumentInstance;
  declare user?: UserInstance;
}

ChangeRecord.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  documentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'documents',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  changes: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('edit', 'format', 'template', 'quantum'),
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
}, {
  sequelize,
  modelName: 'ChangeRecord',
  tableName: 'change_records'
});

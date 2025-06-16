import type { Schema, Struct } from '@strapi/strapi';

export interface ChoiceChildSinglePrice extends Struct.ComponentSchema {
  collectionName: 'components_choice_child_single_prices';
  info: {
    description: '';
    displayName: 'First Level';
    icon: 'gift';
  };
  attributes: {
    barcode: Schema.Attribute.String;
    discount: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    images: Schema.Attribute.Media<'images' | 'files' | 'videos', true>;
    is_discount_percent: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    is_visible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    old_price: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    price: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    sku_code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 16;
        minLength: 3;
      }>;
    stock_quantity: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Schema.Attribute.DefaultTo<0>;
    text: Schema.Attribute.String & Schema.Attribute.Required;
    vat_included: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    vat_percent: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
  };
}

export interface ChoiceChildTwicePrice extends Struct.ComponentSchema {
  collectionName: 'components_choice_child_twice_prices';
  info: {
    description: '';
    displayName: 'Second Level';
  };
  attributes: {
    is_visible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    items: Schema.Attribute.Component<'choice-child.single-price', true> &
      Schema.Attribute.Required;
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ChoicesSinglePrice extends Struct.ComponentSchema {
  collectionName: 'components_choices_single_prices';
  info: {
    description: '';
    displayName: 'Single Variant';
    icon: 'command';
  };
  attributes: {
    is_visible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    items: Schema.Attribute.Component<'choice-child.single-price', true>;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Renk'>;
  };
}

export interface ChoicesTwicePrice extends Struct.ComponentSchema {
  collectionName: 'components_choices_twice_prices';
  info: {
    description: '';
    displayName: 'Double Variant';
  };
  attributes: {
    is_visible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    items: Schema.Attribute.Component<'choice-child.twice-price', true> &
      Schema.Attribute.Required;
    label1: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Renk'>;
    label2: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Beden'>;
  };
}

export interface OrderOrderItem extends Struct.ComponentSchema {
  collectionName: 'components_order_order_items';
  info: {
    description: '';
    displayName: 'Order Item';
  };
  attributes: {
    image_url: Schema.Attribute.String;
    name: Schema.Attribute.String;
    product: Schema.Attribute.Relation<'oneToOne', 'api::product.product'>;
    product_documentId: Schema.Attribute.String;
    qty: Schema.Attribute.Integer & Schema.Attribute.Required;
    sku_code: Schema.Attribute.String & Schema.Attribute.Required;
    stock_quantity: Schema.Attribute.Integer;
    total_price: Schema.Attribute.Decimal;
    unit_price: Schema.Attribute.Decimal;
    variant_info: Schema.Attribute.JSON;
  };
}

export interface PerkChildSimple extends Struct.ComponentSchema {
  collectionName: 'components_perk_child_simples';
  info: {
    description: '';
    displayName: 'Simple';
    icon: 'collapse';
  };
  attributes: {
    is_visible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Se\u00E7im'>;
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PerksSimple extends Struct.ComponentSchema {
  collectionName: 'components_perks_simples';
  info: {
    description: '';
    displayName: 'Simple';
    icon: 'command';
  };
  attributes: {
    is_visible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    items: Schema.Attribute.Component<'perk_child.simple', true>;
    theme: Schema.Attribute.Enumeration<
      [
        'none',
        'dot',
        'circle',
        'list',
        'flex',
        'rando',
        'getta',
        'theme1',
        'theme2',
        'theme3',
      ]
    > &
      Schema.Attribute.DefaultTo<'none'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'choice-child.single-price': ChoiceChildSinglePrice;
      'choice-child.twice-price': ChoiceChildTwicePrice;
      'choices.single-price': ChoicesSinglePrice;
      'choices.twice-price': ChoicesTwicePrice;
      'order.order-item': OrderOrderItem;
      'perk_child.simple': PerkChildSimple;
      'perks.simple': PerksSimple;
    }
  }
}

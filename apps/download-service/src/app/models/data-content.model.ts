export interface DataContentModels {
  title: string;
  content: DataContentItem[];
}

export interface DataContentItem {
  subtitle: string;
  subText: string;
  subContent: string[];
  values: string[];
  text: string[];
}

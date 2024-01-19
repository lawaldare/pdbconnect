export type PdbeButtonStyle = {
    backgroundColor: string,
    fontColor: string,
    borderColor: string,
    shadowColor: string,
    label: string,
    paddingSize: "Small" | "Big",
    mobileIconName: "none" | "search"
}
export class PdbePrimaryButtonStyleDatum {
    backgroundColor = "#C66717";
    fontColor = "#FFFFFF";
    borderColor = "#C66717";
    shadowColor = "#B65417";
    label = "Primary";
    paddingSize = "Small";
    mobileIconName = "none";
}
export class PdbeSecondaryButtonStyleDatum {
    backgroundColor = "#FFFFFF";
    fontColor = "#0A5032";
    borderColor = "#0A5032";
    shadowColor = "#0A5032";
    label = "Secondary";
    paddingSize = "Small";
    mobileIconName = "none";
}
export class PdbeKbSecondaryButtonStyleDatum {
    backgroundColor = "#FFFFFF";
    fontColor = "#217976";
    borderColor = "#217976";
    shadowColor = "#0F5C5A";
    label = "Secondary";
    paddingSize = "Small";
    mobileIconName = "none";
}
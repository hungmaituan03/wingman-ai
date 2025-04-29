// src/screens/Trip/TripCard.styles.js

import { StyleSheet, Dimensions } from "react-native";
import { Colours } from "../../../constants/Colours";

const { width } = Dimensions.get("window");
const ICON_CIRCLE_SIZE = 25;

// ─── DRY: color constants ───────────────────────────────────────────────────
const BORDER_COLOR     = "#e0e0e0";
const TEXT_PRIMARY     = "#333333";
const TEXT_SECONDARY   = "#555555";
const TEXT_TERTIARY    = "#777777";
const LINK_COLOR       = "#007bff";
const BUTTON_BG        = Colours[200];
const BUTTON_TEXT      = "#ffffff";
const CARD_BACKGROUND  = Colours[50];
const TAG_BG           = Colours[300];
const TAG_TEXT         = "black";
const INFO_BG          = "#f5f5f5";

// ─── DRY: font constants ────────────────────────────────────────────────────
const FONT_REGULAR     = "Poppins-Regular";
const FONT_MEDIUM      = "Poppins-Medium";
const FONT_BOLD        = "Poppins-Bold";

export default StyleSheet.create({
  // ─── Layout ───────────────────────────────────────────────────────────────
  safeArea: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  // ─── Card Container ──────────────────────────────────────────────────────
  card: {
    backgroundColor: CARD_BACKGROUND,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,             // Android shadow
    shadowColor: "#000",      // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },

  // ─── Header Row ─────────────────────────────────────────────────────────
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: ICON_CIRCLE_SIZE + 16, // reserve space for the fixed map icon
    marginBottom: 8,
  },
  headerIcons: {
    position: "absolute",
    top: 16,
    right: 16,
    width: ICON_CIRCLE_SIZE,
    height: ICON_CIRCLE_SIZE,
    borderRadius: ICON_CIRCLE_SIZE / 2,
    backgroundColor: BUTTON_BG,
    justifyContent: "center",
    alignItems: "center",
  },

  // ─── Typography ──────────────────────────────────────────────────────────
  cardHeader: {
    flex: 1,
    fontFamily: FONT_BOLD,
    fontSize: 20,
    color: TEXT_PRIMARY,
  },
  addressText: {
    fontFamily: FONT_REGULAR,
    fontSize: 14,
    color: TEXT_SECONDARY,
    marginBottom: 6,
  },
  ratingText: {
    fontFamily: FONT_REGULAR,
    fontSize: 14,
    color: TEXT_TERTIARY,
    marginBottom: 6,
  },
  detailsText: {
    fontFamily: FONT_REGULAR,
    fontSize: 14,
    color: TEXT_SECONDARY,
    marginBottom: 6,
  },
  link: {
    fontFamily: FONT_MEDIUM,
    fontSize: 14,
    color: LINK_COLOR,
    textDecorationLine: "underline",
    marginBottom: 6,
  },

  // ─── Tag Row / Pills ─────────────────────────────────────────────────────
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 8,
  },
  tagBox: {
    backgroundColor: TAG_BG,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagBoxText: {
    fontFamily: FONT_MEDIUM,
    fontSize: 12,
    color: TAG_TEXT,
  },

  // ─── Info‐Bar (price / phone / website / hours) ─────────────────────────
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  infoBox: {
    flex: 1,
    alignItems: "center",
    backgroundColor: BUTTON_BG,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  infoIcon: {
    marginBottom: 4,
    color: Colours[900],
  },
  infoValue: {
    fontFamily: FONT_MEDIUM,
    marginTop: 5,
    fontSize: 14,
    color: Colours[950],
  },

  // ─── Photo Grid ─────────────────────────────────────────────────────────
  photoContainer: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    // gap: 8, // RN ≥0.71 only
  },
  image: {
    width: (width - 64) / 2, // two across with padding + gap
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },

  // ─── Legacy Buttons (if still used) ─────────────────────────────────────
  mapButton: {
    backgroundColor: BUTTON_BG,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  mapButtonText: {
    fontFamily: FONT_MEDIUM,
    fontSize: 14,
    color: BUTTON_TEXT,
  },
  backButton: {
    alignSelf: "flex-start",
    marginTop: 16,
    marginBottom: 8,
    marginLeft: 10,
  },
});

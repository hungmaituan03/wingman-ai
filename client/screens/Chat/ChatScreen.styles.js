import { StyleSheet, Platform } from 'react-native';
import colors from '../../constants/Colors';

export default StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  floatingBackButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 30,
    left: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 10,
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#FFFFFF' 
  },
  messagesWrapper: { 
    flex: 1,
    zIndex: 1,
  },
  messagesContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF'
  },
  messageRow: { 
    flexDirection: 'row', 
    alignItems: 'flex-end', 
    marginBottom: 12,
  },
  botRow: { 
    justifyContent: 'flex-start' 
  },
  userRow: { 
    justifyContent: 'flex-end' 
  },
  botAvatar: { 
    marginRight: 8 
  },
  userAvatar: {
    width: 32, 
    height: 32, 
    borderRadius: 16,
    backgroundColor: '#6E44FF',
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 10,
    padding: 5,
  },
  avatarImage: { 
    width: 32, 
    height: 32, 
    borderRadius: 16,
    marginLeft: 10,
  },
  messageContainer: { 
    maxWidth: '80%' 
  },
  botContainer: { 
    alignItems: 'flex-start' 
  },
  userContainer: { 
    alignItems: 'flex-end' 
  },
  botBubble: {
    backgroundColor: '#F0ECFF',
    borderRadius: 15,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#C8B5FF',
  },
  userBubble: {
    backgroundColor: '#E6E2FF',
    borderRadius: 15,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#C8B5FF',
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    lineHeight: 22,
    color: '#2D2D2D',
  },
  messageTime: {
    fontSize: 11,
    color: '#666',
    fontFamily: 'Poppins_400Regular',
    marginTop: 4,
    padding: 5,
  },
  mapButton: { 
    marginTop: 8 
  },
  mapButtonText: {
    color: '#6E44FF',
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 10,
    zIndex: 5, // ✅ important
  },
  inputCard: {
    borderRadius: 20,
    padding: 12,
    backgroundColor: '#F8F6FF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 6
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: '#333',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: '#D3C1FF',
    backgroundColor: '#FFFFFF',
  },
  placeInput: { 
    marginRight: 8 
  },
  radiusContainer: { 
    flexDirection: 'row', 
    width: 110
  },
  radiusInput: { 
    flex: 1, 
    marginRight: 8, 
    textAlign: 'center' 
  },
  unitButton: {
    width: 46,
    height: 38,
    backgroundColor: '#E6E2FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unitText: {
    color: '#4C3D99',
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
  },
  descriptionInput: { 
    marginRight: 8, 
    minHeight: 44,
    textAlignVertical: 'top' 
  },
  sendButton: {
    width: 46,
    height: 46,
    backgroundColor: '#BCA9FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: { 
    opacity: 0.5 
  },
  placeCard: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#F4F4FA',
    borderColor: '#DAD0FF',
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  placeName: {
    fontSize: 17,
    fontFamily: 'Poppins_600SemiBold',
    color: '#2D2D2D',
    marginBottom: 4,
  },
  placeAddress: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 4,
  },
  placeRating: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 4,
  },
  placeSummary: {
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
    paddingBottom: 10,
  },
  placeExplanation: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  placeOpeningHours: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  placePrice: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  suggestionsContainer: {
    maxHeight: 150,
    backgroundColor: '#FFFFFF',
    borderColor: '#D3C1FF',
    borderWidth: 1.5,
    borderRadius: 12,
    marginTop: 2, 
    marginBottom: 8,
    overflow: 'hidden',
    paddingHorizontal: 12, // <-- ✅ NEW: match the TextInput padding
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  suggestionItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#333',
  },  
  placeInputWrapper: {
    flex: 1,
    position: 'relative',
  },
});
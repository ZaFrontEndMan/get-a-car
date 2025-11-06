// Types for the API response data
export interface Image {
  imageUrl: string;
  imageDescription: string;
}

export interface CancellationPolicy {
  name: string;
  description: string;
}

export interface CarService {
  id: number;
  name: string;
  description: string;
  price: number;
}

export interface Protection {
  id: string;
  name: string;
  description: string;
}

export interface Location {
  address: string;
  isActive: boolean;
  id: number;
}

export interface RatingStats {
  numberOfRating: number;
  percentage: number;
}

export interface CustomMessage {
  httpStatus: number;
  code: number;
  messageKey: string;
}

export interface Car {
  id: number;
  name: string;
  description: string;
  transmission: string;
  transmissionId: number;
  model: string;
  modelId: number;
  tradeMark: string;
  tradeMarkId: number;
  fuelType: string;
  fuelTypeId: number;
  type: string;
  typeId: number;
  branchName: string;
  branchId: string;
  pricePerDay: number;
  pricePerWeek: number;
  pricePerMonth: number;
  availabilityVendor: boolean;
  availabilityAdmin: boolean;
  withDriver: boolean;
  liter: string;
  doors: string;
  vendorCanMakeOffer: boolean;
  people: any | null;

  electricMirrors: boolean;
  cruiseControl: boolean;
  fogLights: boolean;
  power: boolean;
  roofBox: boolean;
  gps: boolean;
  remoteControl: boolean;
  audioInput: boolean;
  cdPlayer: boolean;
  bluetooth: boolean;
  usbInput: boolean;
  sensors: boolean;
  ebdBrakes: boolean;
  airbag: boolean;
  absBrakes: boolean;

  year: number;
  images: Image[];
  protectionPrice: number;
  cancellationPolicies: CancellationPolicy[];
  carServices: CarService[];
  protections: Protection[];
  pickUpLocations: Location[];
  dropOffLocations: Location[];

  feedBackNumber: number;
  rating: number | null;
  oneStarRatingStats: RatingStats;
  twoStarRatingStats: RatingStats;
  threeStarRatingStats: RatingStats;
  fourStarRatingStats: RatingStats;
  fiveStarRatingStats: RatingStats;
  feedbackDtos: any[];
}

export interface CarData {
  data: Car;
  isSuccess: boolean;
  customMessage: CustomMessage | string;
}

export interface ApiResponse {
  data: CarData;
}

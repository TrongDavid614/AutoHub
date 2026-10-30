import { MOCK_CARS, type MockCar } from '../mocks/car.mock';

export const carService = {
  getAllCars(): Promise<MockCar[]> {
    return Promise.resolve(MOCK_CARS);
  },

  getCarById(id: string): Promise<MockCar | null> {
    const car = MOCK_CARS.find((c) => c.id === id) || null;
    return Promise.resolve(car);
  },
};

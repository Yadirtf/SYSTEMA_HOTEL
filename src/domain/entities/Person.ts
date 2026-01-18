export class Person {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly document: string,
    public readonly phone: string,
    public readonly status: 'ACTIVE' | 'INACTIVE',
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}


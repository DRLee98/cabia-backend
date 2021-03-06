import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Review } from '../entities/review.entity';

@InputType()
export class CreateMenuReviewInput extends PickType(Review, ['contents']) {
  @Field((type) => Int)
  score: number;

  @Field((type) => Int)
  cafeId: number;

  @Field((type) => Int)
  menuId: number;
}

@ObjectType()
export class CreateMenuReviewOutput extends CoreOutput {
  @Field((type) => Int, { nullable: true })
  reviewId?: number;
}

#import "UICollectionViewCacheDelegateFlowLayout.h"

@implementation UICollectionViewCacheDelegateFlowLayout
@synthesize cachedSizes;
- (instancetype)init
{
  self = [super init];
  if (self) {
    self.cachedSizes = [NSMutableArray new];
  }
  return self;
}
- (CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout computedSizeForItemAtIndexPath:(NSIndexPath *)indexPath
{
    return CGSizeZero;
}

- (CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout sizeForItemAtIndexPath:(NSIndexPath *)indexPath
{
  NSInteger index = indexPath.row;
  if (index < [self.cachedSizes count]) {
      NSValue* value =  [self.cachedSizes objectAtIndex:indexPath.row];
      if (value != nil && !CGSizeEqualToSize([value CGSizeValue], CGSizeZero)) {
          return [value CGSizeValue];
      }
    CGSize size = [self collectionView:collectionView layout:collectionViewLayout computedSizeForItemAtIndexPath:indexPath];
    [self.cachedSizes replaceObjectAtIndex:indexPath.row withObject:[NSValue valueWithCGSize:size]];
    return size;
  } else {
    CGSize size = [self collectionView:collectionView layout:collectionViewLayout computedSizeForItemAtIndexPath:indexPath];
    [self.cachedSizes addObject:[NSValue valueWithCGSize:size]];
    return size;
  }
}

@end

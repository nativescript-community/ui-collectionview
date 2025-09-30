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
  NSInteger count = [self.cachedSizes count];
  if (index < count) {
      NSValue* value =  [self.cachedSizes objectAtIndex:index];
      if (value != nil && !CGSizeEqualToSize([value CGSizeValue], CGSizeZero)) {
          return [value CGSizeValue];
      }
  }
  CGSize size = [self collectionView:collectionView layout:collectionViewLayout computedSizeForItemAtIndexPath:indexPath];
  count = [self.cachedSizes count];
  if (index < count) {
    [self.cachedSizes replaceObjectAtIndex:indexPath.row withObject:[NSValue valueWithCGSize:size]];
  } else {
    [self.cachedSizes addObject:[NSValue valueWithCGSize:size]];
  }
  return size;
}

@end

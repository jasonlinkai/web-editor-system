import * as React from "react";
import { Card, CardContent } from "@/component_base/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/component_base/ui/carousel";

const CarouselComponent: React.FC<{
  images?: string[];
}> = ({ images = [] }) => {
  return (
    <Carousel className={"w-full min-h-60 bg-slate-100"}>
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={`${index}-${image}`}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6"></CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};
export default CarouselComponent;
